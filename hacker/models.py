from django.db import models
from django.contrib.auth.models import User
from django.db.models import Count
from django.core.urlresolvers import reverse
from django.db.models.signals import post_save
from django.utils import timezone

class LikeCounter(models.Manager):
    def get_query(self):
        return super(LikeCounter, self).get_query().annotate(
            votes=Count('vote')).order_by('-ranking', '-votes')


class Link(models.Model):
    title = models.CharField("Headline", max_length=100)
    submit_by = models.ForeignKey(User)
    submit_on = models.DateTimeField(default=timezone.now())
    ranking = models.FloatField(default=0.0)
    url = models.URLField("URL", max_length=100, blank=True)
    description = models.TextField(blank=True)

    likes =  LikeCounter()
    objects = models.Manager()            # default manager

    def __unicode__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("link_detail", kwargs={"pk": str(self.id)})

    def ranker(self):

        HOUR = float(60*60)
        Weight = 1.2

        tec = timezone.now() - self.submit_on
        item_time = tec.total_seconds() // HOUR
        votes = self.votes - 1
        self.ranking = votes / pow((item_time+2), Weight)
        self.save()

class Like(models.Model):
    liker = models.ForeignKey(User)
    link = models.ForeignKey(Link)

    def __unicode__(self):
        return "%s voted %s" % (self.liker.username, self.link.title)

class User(models.Model):
    user = models.OneToOneField(User, unique=True)
    # Extra attributes
    details = models.TextField(null=True)

    def __unicode__(self):
        return "%s's profile" % self.user

def profile_creator(sender, instance, created, **kwargs):
    if created:
        profile, created = User.objects.get_or_create(user=instance)


post_save.connect(profile_creator, sender=User)