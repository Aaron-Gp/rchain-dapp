# Generated by Django 1.11.6 on 2018-01-03 18:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("zerver", "0131_realm_create_generic_bot_by_admins_only"),
    ]

    operations = [
        migrations.AddField(
            model_name="realm",
            name="message_visibility_limit",
            field=models.IntegerField(null=True),
        ),
    ]
