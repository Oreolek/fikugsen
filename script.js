function parameter(id, name, value) {
	if (typeof value === 'undefined') {
		value = 5;
	}
	return {
		id: id,
		name: name,
		value: value
	};
}
parameter.prototype.increment = function () {
	this.value = this.value + 1;
};
parameter.prototype.decrement = function () {
	this.value = this.value - 1;
};
function positive(value) {
	if (value < 1) return 1;
	else return value;
}
var options = {
	specials: {
		strength: parameter('strength', 'Сила'),
		endurance: parameter('endurance', 'Выносливость'),
		charisma: parameter('charisma', 'Обаяние'),
		intelligence: parameter('intelligence', 'Интеллект'),
		agility: parameter('agility', 'Ловкость'),
		luck: parameter('luck', 'Удача'),
	},
	special_points: 5,
	skills_to_tag: 3,
	derived: [
		parameter('action_points','Очки действий', function(specials){
			return Math.floor(5 + specials.agility.value * 0.5);
		}),
		parameter('carry_weight','Максимальный вес, кг', function(specials){
			return 6 + specials.strength.value * 10;
		}),
		parameter('critical_chance','Критический шанс, %', function(specials){
			return specials.luck.value;
		}),
		parameter('hit_points','Очки Здоровья', function(specials){
			return 15 + specials.strength.value + specials.endurance.value * 2;
		}),
		parameter('skill_points','Очки навыков на уровень', function(specials){
			return 5 + specials.intelligence.value * 2;
		}),
		parameter('combat_sequence','Очерёдность в бою', function(specials){
			return Math.floor(specials.agility.value + (specials.luck.value + specials.strength.value) * 0.5);
		}),
		parameter('healing_rate','Скорость лечения', function(specials){
			return specials.endurance.value + 6;
		}),
		parameter('throwing_range','Дальность броска, м', function(specials){
			return specials.strength.value + 6;
		}),
		parameter('poison_resistance','Сопротивление яду, %', function(specials){
			return specials.endurance.value * 5;
		}),
		parameter('radiation_resistance','Сопротивление радиации, %', function(specials){
			return specials.endurance.value * 2;
		}),
		parameter('armor_class','Базовый класс брони', function(specials){
			return specials.agility.value;
		}),
		parameter('melee_damage','Рукопашный урон', function(specials){
			return positive(specials.strength.value - 5);
		})
	],
	skills: {
	}
};
function rewrite_value(newvalue) {
	jQuery(this).siblings(".value").text(newvalue);
}
function update_derived() {
	var i = 0;
	jQuery('#derived').empty();
	for (i = 0; i < options.derived.length; i++) {
		jQuery('#derived').append('<div class="parameter"><div class="value" id="' + options.derived[i].id + '"> '+ options.derived[i].value(options.specials) + ' </div></div><div class="name">' + options.derived[i].name + '</div>');
	}
}

jQuery(document).ready(function () {
	var i = 0;
	objects = ['strength',	'endurance', 'charisma', 'intelligence', 'agility', 'luck'];
	for (i = 0; i < objects.length; i++) {
		jQuery('#specials').append('<div class="parameter"><a class="decrement" href="#">–</a><div class="value" id="' + options.specials[objects[i]].id + '"> '+ options.specials[objects[i]].value + ' </div><a class="increment" href="#">+</a></div><div class="name">' +	options.specials[objects[i]].name + '</div>');
	}
	update_derived();
	jQuery('#specials .increment').click(function () {
		for (i = 0; i < objects.length; i++) {
			if (options.specials[objects[i]].id === jQuery(this).id) {
				options.specials[objects[i]].increment();
				rewrite_value(options.specials[objects[i]].value);
			}
		}
		update_derived();
	});
});
