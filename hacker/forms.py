from django import forms
from .models import User
from .models import Link
from .models import  Like

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        exclude = ("user",)

class LinkForm(forms.ModelForm):
    class Meta:
        model = Link
        exclude = ("submit_by", "ranker")

class LikeForm(forms.ModelForm):
    class Meta:
        model = Like