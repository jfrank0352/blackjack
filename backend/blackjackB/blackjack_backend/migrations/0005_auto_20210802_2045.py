# Generated by Django 3.2.5 on 2021-08-02 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blackjack_backend', '0004_auto_20210802_1952'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='d_hand_val',
            field=models.IntegerField(blank=True, default=0, verbose_name=2),
        ),
        migrations.AlterField(
            model_name='game',
            name='p_hand_val',
            field=models.IntegerField(blank=True, default=0, verbose_name=2),
        ),
        migrations.AlterField(
            model_name='game',
            name='payout',
            field=models.IntegerField(blank=True, default=0, verbose_name=6),
        ),
    ]
