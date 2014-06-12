import json
from django.http import HttpResponse
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404
from django.views.generic import ListView
from django.views.generic import DetailView
from .models import Link
from .models import User
from .models import  Like
from .forms import UserProfileForm
from .forms import LinkForm
from .forms import LikeForm

from django.contrib.auth import get_user_model
from django.views.generic.edit import CreateView
from django.views.generic.edit import UpdateView
from django.views.generic.edit import DeleteView
from django.views.generic.edit import FormView
from django.core.urlresolvers import reverse, reverse_lazy

from django.contrib.comments.models import Comment



    
class Detail_View(DetailView):
    model = Link

class Create_View(CreateView):
    model = Link
    form_class = LinkForm

    def form_valid(self, form):
        f1 = form.save(commit=False)
        f1.ranker = 0.0
        f1.submit_by = self.request.user
        f1.save()
        return super(Create_View, self).form_valid(form)

class Update_View(UpdateView):
    model = Link
    form_class = LinkForm

class Delete_View(DeleteView):
    model = Link
    success_url = reverse_lazy("home")

class UserDetailView(DetailView):
    model = get_user_model()
    slug_field = "username"
    template_name = "user_detail.html"

    def get_object(self, queryset=None):
        user = super(UserDetailView, self).get_object(queryset)
        User.objects.get_or_create(user=user)
        return user

class UserEditView(UpdateView):
    model = User
    form_class = UserProfileForm
    template_name = "edit_profile.html"

    def get_object(self, queryset=None):
        return User.objects.get_or_create(user=self.request.user)[0]

    def get_success_url(self):
        return reverse("profile", kwargs={"slug": self.request.user})


class JSON_in(object):
    def create_response(self, vdict=dict(), valid_form=True):
        response = HttpResponse(json.dumps(vdict), content_type='application/json')
        response.status = 200 if valid_form else 500
        return response

class Like_form_View(FormView):
    form_class = LikeForm

    def create_response(self, vdict=dict(), valid_form=True):
        response = HttpResponse(json.dumps(vdict))
        response.status = 200 if valid_form else 500
        return response

    def form_valid(self, form):
        link = get_object_or_404(Link, pk=form.data["link"])
        user = self.request.user
        p_likes =  Like.objects.filter(voter=user, link=link)
        h_liked = (len(p_likes) > 0)

        ret = {"success": 1}
        if not h_liked:
            # add vote
            v =  Like.objects.create(liker=user, link=link)
            ret["likeobj"] = v.id
        else:
            # delete vote
            p_likes[0].delete()
            ret["unliked"] = 1
        return self.create_response(ret, True)


    def form_invalid(self, form):
        ret = {"success": 0, "form_errors": form.errors }
        return self.create_response(ret, False)

class Random(object):
    def get_context_data(self, **kwargs):
        context = super(Random, self).get_context_data(**kwargs)
        context[u"randomquip"] = Comment.objects.order_by('?')[0]
        return context

class List_View(Random, ListView):
    model = Link
    queryset = Link.likes.all()
    paginate_by = 5

    def get_context_data(self, **kwargs):
        context = super(List_View, self).get_context_data(**kwargs)
        if self.request.user.is_authenticated():
            liked =  Like.objects.filter(liker=self.request.user)
            links_in_page = [link.id for link in context["object_list"]]
            liked = liked.filter(link_id__in=links_in_page)
            liked = liked.values_list('link_id', flat=True)
            context["voted"] = liked
        return context

class VoteFormView(JSON_in,  Like_form_View):
    pass