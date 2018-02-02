from django import forms

class ProductForm(forms.Form):
    product = forms.CharField(max_length=30)
    price = forms.CharField(max_length=10)

    def clean(self):
        cleaned_data = super(ProductForm, self).clean()
        product = cleaned_data.get('product')
        price = cleaned_data.get('price')
        if not product and not price:
            raise forms.ValidationError('You have to write something!')
