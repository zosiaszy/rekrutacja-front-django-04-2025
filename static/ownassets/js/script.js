document.addEventListener('DOMContentLoaded', function () {

  const calendarEl = document.getElementById('calendar');

  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'pl',
      themeSystem: 'bootstrap5',
      height: 'auto',
      contentHeight: 'auto',
      dayMaxEventRows: true,
      moreLinkText: 'więcej',

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },

      buttonText: {
        today: 'Dzisiaj'
      },

      events: '/api/events/',

      eventClick: function (info) {
        window.location.href = `/events/${info.event.id}/`;
      },

      eventDidMount: function (info) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.innerText = `${info.event.title} – ${info.event.start.toLocaleString('pl-PL')}`;

        document.body.appendChild(tooltip);

        info.el.addEventListener('mouseenter', () => {
          tooltip.style.display = 'block';
          const rect = info.el.getBoundingClientRect();
          tooltip.style.left = `${rect.left + window.scrollX}px`;
          tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
        });

        info.el.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none';
        });

        info.el.setAttribute('aria-label', tooltip.innerText);
        info.el.setAttribute('tabindex', '0');
        info.el.style.cursor = 'pointer';
      }
    });

    calendar.render();
 
  }

  const panel = document.getElementById('accessibility-panel');
  const toggle = document.getElementById('accessibility-toggle');

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      panel.classList.toggle('visually-hidden');
      panel.focus();
  
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        panel.classList.add('visually-hidden');
      }
    });

    const actions = {
      'increase-font': () => changeFontSize(1),
      'decrease-font': () => changeFontSize(-1),
      'reset-font': () => document.body.style.fontSize = '1rem',
      'toggle-contrast': () => document.body.classList.toggle('high-contrast'),
      'toggle-animations': () => document.body.classList.toggle('no-animations'),
      'toggle-big-cursor': () => document.body.classList.toggle('big-cursor'),
      'toggle-highlight-links': () => document.body.classList.toggle('highlight-links'),
    };

    panel.querySelectorAll('button[data-action]').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        actions[action]?.();
        savePreferences();
      });
    });

    function changeFontSize(delta) {
      const current = parseFloat(getComputedStyle(document.body).fontSize);
      document.body.style.fontSize = `${current + delta}px`;
    }

    function savePreferences() {
        localStorage.setItem('accessibilityPrefs', JSON.stringify({
        fontSize: document.body.style.fontSize,
        contrast: document.body.classList.contains('high-contrast'),
        animations: !document.body.classList.contains('no-animations'),
        highlightLinks: document.body.classList.contains('highlight-links'),
        }));
    }

   function loadPreferences() {
        const prefs = JSON.parse(localStorage.getItem('accessibilityPrefs') || '{}');
        if (prefs.fontSize) document.body.style.fontSize = prefs.fontSize;
        if (prefs.contrast) document.body.classList.add('high-contrast');
        if (prefs.animations === false) document.body.classList.add('no-animations');
        if (prefs.highlightLinks) document.body.classList.add('highlight-links');
    }

    loadPreferences();
  }
});
