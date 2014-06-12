from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required as auth
from django.contrib import admin
admin.autodiscover()

from hacker.views import List_View
from hacker.views import Detail_View
from hacker.views import UserDetailView
from hacker.views import UserEditView
from hacker.views import Create_View
from hacker.views import Update_View
from hacker.views import Delete_View
from hacker.views import VoteFormView
urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^comments/', include("django.contrib.comments.urls")),
    url(r'^$', List_View.as_view(), name='home'),

    url(r"^login/$", "django.contrib.auth.views.login",
        {"template_name": "login.html"}, name="login"),
    url(r"^logout/$", "django.contrib.auth.views.logout_then_login",
        name="logout"),

    url(r"^accounts/", include("registration.backends.simple.urls")),
    url(r"^users/(?P<slug>\w+)/$", UserDetailView.as_view(),
        name="profile"),
    url(r"edit_profile/$", auth(UserEditView.as_view()),
        name="edit_profile"),

    url(r"^link/create/$", auth(Create_View.as_view()),
        name="link_create"),
    url(r"^link/(?P<pk>\d+)$", Detail_View.as_view(),
        name="link_detail"),
    url(r"^link/update/(?P<pk>\d+)/$", auth(Update_View.as_view()),
        name="link_update"),
    url(r"^link/delete/(?P<pk>\d+)/$", auth(Delete_View.as_view()),
        name="link_delete"),

    url(r'^vote/$', auth(VoteFormView.as_view()), name="vote"),
    )