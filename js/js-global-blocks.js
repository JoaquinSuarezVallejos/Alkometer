// JAVASCRIPT

dayjs.locale('es');
dayjs.extend(window.dayjs_plugin_duration);
dayjs.extend(window.dayjs_plugin_relativeTime);

// COPYRIGHT YEAR (AUTOMATIC)
let getyear = new Date().getFullYear();
let getyeardiv = document.getElementById("year");
getyeardiv.innerHTML = getyear;

const ETHANOL_DENSITY = 0.789;
const ELIMINATION_RATE_PER_HOUR = 0.15; // g/L por hora
const R = { male: 0.68, female: 0.55 };

const drinks = {
  vino: {
    name: 'Vino',
    volume: 200,
    alcoholGraduation: 12.5
  },
  cerveza: {
    name: 'Cerveza',
    volume: 500,
    alcoholGraduation: 5
  },
  sidra: {
    name: 'Sidra',
    volume: 100,
    alcoholGraduation: 6
  },
  sake: {
    name: 'Sake',
    volume: 150,
    alcoholGraduation: 15
  },
  hidromiel: {
    name: 'Hidromiel',
    volume: 100,
    alcoholGraduation: 14
  },
  ginebra: {
    name: 'Ginebra',
    volume: 50,
    alcoholGraduation: 43.5
  },
  ron: {
    name: 'Ron',
    volume: 50,
    alcoholGraduation: 45
  },
  brandy: {
    name: 'Brandy',
    volume: 50,
    alcoholGraduation: 43
  },
  tequila: {
    name: 'Tequila',
    volume: 50,
    alcoholGraduation: 45
  },
  whisky: {
    name: 'Whisky',
    volume: 100,
    alcoholGraduation: 43.5
  },
  vodka: {
    name: 'Vodka',
    volume: 50,
    alcoholGraduation: 45
  }
};

const alcoholGaugeValues = [
  { from: 0, color: 'green', icon: '🚶', title: 'Sobrio' },
  { from: 0.1, color: 'blue', icon: '🍺', title: 'Sin efectos aparentes' },
  { from: 0.3, color: 'yellow', icon: '🍻', title: 'Disminución de la coordinación' },
  { from: 0.8, color: 'orange', icon: '🍷', title: 'Euforia y desinhibición' },
  { from: 1.5, color: 'red', icon: '🥃', title: 'Náuseas y pérdida de control' },
  { from: 2.5, color: 'purple', icon: '🍸', title: 'Riesgo de coma etílico' },
  { from: 3.5, color: 'black', icon: '⚰️', title: 'Riesgo de muerte' },
];

// HEADER FIXED
function headerfixed() {
  let getheaderdiv = document.getElementsByTagName("header")[0].classList;
  if (document.documentElement.scrollTop > 20) {
    getheaderdiv.add("fixed");
  } 
  else {
    getheaderdiv.remove("fixed");
  }
}
window.onscroll = headerfixed;

// JQUERY
$(() => {
  /* Calculator */
  let pageIndex = 0;
  const calculator = $('#calculator');
  const calculatorPages = calculator.find('#calculator-pages');
  const continueButtons = calculator.find('.continue-btn');
  const goBackButton = calculator.find('#back-btn');
  const restartButton = calculator.find('#restart-btn');
  const drinksTable = calculator.find('#drinks-table');
  const drinksTableAdd = drinksTable.find('#drinks-table-add');
  const drinkRowTemplate = $('#calculator-drink-row-template').contents().clone();

  const personalDataForm = calculator.find('#personal-info');

  const resultsPage = calculator.find('#results');
  const resultsTitle = resultsPage.find('h3');
  const resultsText = resultsPage.find('p');
  const gauge = resultsPage.find('#gauge');

  const allPages = calculatorPages.children();

  const pagesHeight = allPages.map(function() {
    return $(this).outerHeight();
  });

  // Listen for changes in the height of each page.
  // If the height changes and its the active page, update the height of the container
  // and the pagesHeight array
  allPages.each(function(index) {
    const observer = new ResizeObserver(() => {
      const newHeight = $(this).outerHeight();

      if (newHeight !== pagesHeight[index]) {
        pagesHeight[index] = newHeight;
        if (index === pageIndex) {
          calculatorPages.css('height', `${newHeight}px`);
        }
      }
    });
    observer.observe(this);
  });

  // Populate the template select with the drinks
  const drinkSelect = drinkRowTemplate.find('select');
  for (const drink in drinks) {
    drinkSelect.append(`<option value="${drink}">${drinks[drink].name}</option>`);
  }

  const setGauge = (progress, color, icon) => {
    gauge.css('--progress', Math.max(0, Math.min(1, progress)));
    gauge.css('--color', color);
    gauge.css('--icon', `'${icon}'`);
  }

  const checkRowsRemoveButton = () => {
    const rows = drinksTable.find('.drink-row');

    rows.each(function() {
      const deleteButton = $(this).find('.delete-btn');
      if (rows.length === 1) {
        deleteButton.addClass('hidden');
      } else {
        deleteButton.removeClass('hidden');
      }
    });

    // If there are 5 rows or more, hide the add button
    if (rows.length >= 5) {
      drinksTableAdd.addClass('hidden');
    } else {
      drinksTableAdd.removeClass('hidden');
    }
  };
  
  const addRow = () => {
    const drinkRow = drinkRowTemplate.clone();
    const deleteButton = drinkRow.find('.delete-btn');
    deleteButton.on('click', function() {
      // Ignore if there is only one row
      if (drinksTable.find('.drink-row').length === 1) {
        return;
      }
      drinkRow.remove();
      checkRowsRemoveButton();
    });

    // When a drink is selected, update the alcoholGraduation input (named graduation) and the volume input (named ml)
    drinkRow.find('select').on('change', function() {
      const drink = drinks[$(this).val()];
      drinkRow.find('[name="graduation"]').val(drink.alcoholGraduation);
      drinkRow.find('[name="ml"]').val(drink.volume);
      drinkRow.find('[name="hours-passed"]').val(1);
    });

    drinkRow.addClass('drink-row');
    drinksTableAdd.before(drinkRow);
    checkRowsRemoveButton();
  };

  const removeRows = () => {
    drinksTable.find('.drink-row').remove();
    addRow();
    checkRowsRemoveButton();
  };

  const onPageLoadHandlers = [
    () => {},
    () => {
      removeRows();
    },
    () => {
      const rows = drinksTable.find('.drink-row');
      const personalData = {
        weight: personalDataForm.find('[name="weight"]').val(),
        gender: personalDataForm.find('[name="gender"]').val(),
      };

      const r = R[personalData.gender];

      const drinksData = [];
      rows.each(function() {
        const row = $(this);

        const drink = row.find('[name="drink"]').val();
        const graduation = row.find('[name="graduation"]').val();
        const volumeMl = row.find('[name="ml"]').val();
        const hoursPassed = row.find('[name="hours-passed"]').val();
        const drinkedAlcoholMass = ((volumeMl * graduation) / 100) * ETHANOL_DENSITY;
        const currentAlcoholMass = drinkedAlcoholMass / (r * personalData.weight) - (ELIMINATION_RATE_PER_HOUR * hoursPassed);

        drinksData.push({
          drink,
          graduation,
          volumeMl,
          hoursPassed,
          drinkedAlcoholMass,
          currentAlcoholMass,
        });
      });

      const totalDrinkedAlcoholMass = drinksData.reduce((acc, drink) => acc + drink.drinkedAlcoholMass, 0);
      const bloodAlcoholConcentration = drinksData.reduce((acc, drink) => acc + drink.currentAlcoholMass, 0);
      const timeToSober = bloodAlcoholConcentration / ELIMINATION_RATE_PER_HOUR;
      const timeToSoberHumanized = dayjs.duration({ hours: timeToSober }).humanize();

      const gaugeValue = alcoholGaugeValues.find((value) => value.from >= bloodAlcoholConcentration) || alcoholGaugeValues[alcoholGaugeValues.length - 1];
      const gaugeMax = alcoholGaugeValues[alcoholGaugeValues.length - 1].from;
      setGauge(bloodAlcoholConcentration / gaugeMax, gaugeValue.color, gaugeValue.icon);
      console.log({ bloodAlcoholConcentration, totalDrinkedAlcoholMass, timeToSoberHumanized });

      resultsTitle.text(gaugeValue.title);
      resultsText.text(timeToSober > 0
        ? `Tu alcoholemia actual es de ${bloodAlcoholConcentration.toFixed(2)} g/L luego de haber consumido ${totalDrinkedAlcoholMass.toFixed(2)} gramos de alcohol. Tardarás aproximadamente ${timeToSoberHumanized} en estar sobrio.`
        : `Tu alcoholemia actual es de 0 g/L luego de haber consumido ${totalDrinkedAlcoholMass.toFixed(2)} gramos de alcohol. Ya estás sobrio.`
      );
    }
  ];

  // Inicializamos la primera página de antemano para que agregue
  // el row
  onPageLoadHandlers[1]();

  const onPageExitHandlers = [
    () => {
      // No deberia llamarse nunca ya que nunca vamos mas atrás que esto
    },
    () => {
      removeRows();
    },
    () => {
      const firstGaugeValue = alcoholGaugeValues[0];
      setGauge(0, firstGaugeValue.color, firstGaugeValue.icon);
    },
  ];

  drinksTableAdd.on('click', (e) => {
    e.preventDefault();
    addRow();
  });

  const navigateToIndex = (rawIndex, scroll = true) => {
    // Sanitizamos el índice
    let callbacksPageIndex = pageIndex;
    pageIndex = Math.max(0, Math.min(calculatorPages.children().length - 1, rawIndex));

    // Ejecutamos el handler de carga de la página actual,
    // en caso de estar yendo para adelante
    while (callbacksPageIndex < pageIndex) {
      callbacksPageIndex++;
      onPageLoadHandlers[callbacksPageIndex]?.();
    }

    // Mostramos u ocultamos el botón de reinicio
    if (pageIndex === 0) {
      goBackButton.removeClass('show');
    } else {
      goBackButton.addClass('show');
    }

    // Movemos el contenedor de páginas
    calculatorPages.css('transform', `translateX(-${pageIndex * 100}%)`);

    // Actualizamos la altura del contenedor
    calculatorPages.css('height', `${pagesHeight[pageIndex]}px`);

    // Scrolleamos hacia desde donde empieza la calculadora, teniendo
    // en cuenta el alto del header como offset
    if (scroll) {
      $('html, body').animate({
        scrollTop: calculator.offset().top - $('header').outerHeight() - 20,
      });
    }

    // Ejecutamos el handler de salida de la página actual,
    // en caso de estar yendo para antras
    // Se debe esperar a que la animación termine
    setTimeout(
      () => {
        while (callbacksPageIndex > pageIndex) {
          onPageExitHandlers[callbacksPageIndex]?.();
          callbacksPageIndex--;
        }
      },
      300,
    );
  }

  navigateToIndex(pageIndex, false);

  goBackButton.on('click', function() {
    navigateToIndex(pageIndex - 1);
  });

  restartButton.on('click', function() {
    navigateToIndex(0);
  });

  continueButtons.each(function() {
    $(this).on('click', function(event) {
      event.preventDefault();

      // Find parent form, if exists
      let parentForm = $(this).closest('form');
      if (parentForm.length) {
        // Validate form
        if (!parentForm[0].checkValidity()) {
          parentForm[0].reportValidity();
          return;
        }
      }

      navigateToIndex(pageIndex + 1);
    });
  })

  /* Contact form */
  $('#contact-form').on('submit', (e) => {
    e.preventDefault();
    const firstname = $('[name="firstname"]').val();
    const lastname = $('[name="lastname"]').val();
    const email = $('[name="email"]').val();
    const message = $('[name="message"]').val();
    const finalMessage = `¡Hola! Soy ${firstname} ${lastname} (${email}). ${message}`;
    const url = `https://wa.me/5491126438752?text=${finalMessage}`;
    window.open(url, '_blank');
  });
});
