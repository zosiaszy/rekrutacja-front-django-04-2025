from django import forms
from django.utils.translation import gettext_lazy as _
from .models import Event


class EventForm(forms.ModelForm):
    """
    Form for creating and editing events.
    """
    class Meta:
        model = Event
        fields = ['name', 'description', 'start_date', 'end_date', 'location', 'mode', 'organizer', 'color', 'capacity']
        widgets = {
            'start_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
            'end_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
            'description': forms.Textarea(attrs={'rows': 4}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add Bootstrap classes to form fields
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'

        self.fields['name'].widget.attrs['placeholder'] = _('Wprowadź nazwę wydarzenia')
        self.fields['description'].widget.attrs['placeholder'] = _('Opisz wydarzenie')
        self.fields['start_date'].widget.attrs['placeholder'] = _('Wybierz datę i godzinę rozpoczęcia')
        self.fields['end_date'].widget.attrs['placeholder'] = _('Wybierz datę i godzinę zakończenia')
        self.fields['location'].widget.attrs['placeholder'] = _('Podaj miejsce wydarzenia')
        self.fields['organizer'].widget.attrs['placeholder'] = _('Nazwa organizatora')
        self.fields['capacity'].widget.attrs['placeholder'] = _('Maksymalna liczba uczestników')

    def clean(self):
        cleaned_data = super().clean()
        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')
        
        if start_date and end_date and start_date >= end_date:
            raise forms.ValidationError(_('End date must be after start date.'))
        
        return cleaned_data 