function parameter(id, name, value) {
	if (typeof value === 'undefined') {
		value = 5;
	}
	return {
		id: id,
		name: name,
		value: value,
		tagged: false
	};
}
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
	skills: [
		parameter('energy_weapons','Энергетическое оружие', function(specials){
			return specials.agility.value * 2;
		}),
		parameter('guns','Огнестрельное Оружие', function(specials){
			return specials.agility.value * 2;
		}),
		parameter('archery','Стрельба из лука', function(specials){
			return 5 + specials.strength.value + specials.agility.value;
		}),
		parameter('melee','Холодное оружие', function(specials){
			return 20 + 2 * (specials.strength.value + specials.agility.value);
		}),
		parameter('unarmed','Рукопашный бой', function(specials){
			return 30 + 2 * (specials.strength.value + specials.agility.value);
		}),
		parameter('throwing','Метание', function(specials){
			return 4 * specials.agility.value;
		}),
		parameter('lockpick','Взлом', function(specials){
			return 10 + specials.agility.value + specials.intelligence.value;
		}),
		parameter('first_aid','Медицина', function(specials){
			return 15  + specials.intelligence.value;
		}),
		parameter('repair','Ремонт', function(specials){
			return 3 * specials.intelligence.value;
		}),
		parameter('science','Наука', function(specials){
			return 4 * specials.intelligence.value;
		}),
		parameter('stealth','Скрытность', function(specials){
			return 3 * specials.agility.value;
		}),
		parameter('survival','Выживание', function(specials){
			return 2 * (specials.endurance.value + specials.intelligence.value);
		}),
		parameter('performance','Выступление', function(specials){
			return 4 * specials.intelligence.value;
		}),
		parameter('animal_handling','Обращение с животными', function(specials){
			return specials.agility.value + specials.strength.value + specials.intelligence.value;
		}),
		parameter('driving','Вождение', function(specials){
			return 2 * (specials.agility.value + specials.endurance.value);
		})
	]
};
function update_derived() {
	var i = 0;
	var text = '';
	jQuery('#derived').empty();
	jQuery('#skills').empty();
	for (i = 0; i < options.derived.length; i++) {
		jQuery('#derived').append('<div class="parameter"><div class="value" id="' + options.derived[i].id + '"> '+ options.derived[i].value(options.specials) + ' </div></div><div class="name">' + options.derived[i].name + '</div>');
	}
	for (i = 0; i < options.skills.length; i++) {
		text = '<div class="parameter"><div class="value" id="' + options.skills[i].id + '"> '+ options.skills[i].value(options.specials) + ' </div></div><div class="name">' + options.skills[i].name + '<input type="checkbox"';
		if (options.skills[i].tagged) {
			text = text + ' checked';
		}
		text = text + '></div>';
		jQuery('#skills').append(text);
	}
}

jQuery(document).ready(function () {
	var i = 0;
	objects = ['strength',	'endurance', 'charisma', 'intelligence', 'agility', 'luck'];
	for (i = 0; i < objects.length; i++) {
		jQuery('#specials').append('<div class="parameter"><a class="decrement" href="#">–</a><div class="value" id="' + options.specials[objects[i]].id + '"> '+ options.specials[objects[i]].value + ' </div><a class="increment" href="#">+</a></div><div class="name">' +	options.specials[objects[i]].name + '</div>');
	}
	update_derived();
	jQuery('#skills input[type=checkbox]').click(function () {
		if (jQuery(this).is(':checked')) options.skills_to_tag--;
		else options.skills_to_tag++;
		if (options.skills_to_tag <= 0){
			jQuery(this).removeAttr('checked');
		  options.skills_to_tag++;
			return false;
		}
		for (i = 0; i < options.skills.length; i++) {
			if (options.skills[i].id == jQuery(this).siblings(".value").attr('id')) {
				options.skills[i].tagged = !options.skills[i].tagged;
				break;
			}
		}
		update_derived();
	});
	jQuery('#specials .increment').click(function () {
    if (options.special_points == 0) return false;
    options.special_points--;
		for (i = 0; i < objects.length; i++) {
			if (options.specials[objects[i]].id == jQuery(this).siblings(".value").attr('id')) {
				options.specials[objects[i]].value++;
        jQuery(this).siblings(".value").text(' '+options.specials[objects[i]].value+' ');
				break;
			}
		}
		update_derived();
	});
  jQuery('#specials .decrement').click(function () {
    options.special_points++;
		for (i = 0; i < objects.length; i++) {
			if (options.specials[objects[i]].id == jQuery(this).siblings(".value").attr('id')) {
				options.specials[objects[i]].value--;
        jQuery(this).siblings(".value").text(' '+options.specials[objects[i]].value+' ');
				break;
			}
		}
		update_derived();
	});
});
