import getpass
from argparse import ArgumentParser
from typing import Any

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import CommandError

from zerver.lib.management import ZulipBaseCommand
from zerver.models import Extension

class Command(ZulipBaseCommand):

    help = "curd all extension."

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("-m", "--mode", required=True, help="CRUD")
        parser.add_argument("--id", required=False, help="selected id, can be a list like: --id 1 2 3", nargs="+", type=int)
        parser.add_argument("--all", required=False, help="select all", action='store_true', default=False)
        parser.add_argument("--name", required=False, help="ext name", type=str)
        parser.add_argument("--link", required=False, help="ext link", type=str)


    def handle(self, *args: Any, **options: Any) -> str:
        mode:str = options["mode"]
        if mode.lower() == "c":
            name = options["name"]
            link = options["link"]
            assert name is not None and link is not None
            obj = Extension.objects.create(name=name, link=link)
            self.stdout.write(
                self.style.SUCCESS(
                    f"create {obj.__str__()}"
                )
            )
        elif mode.lower() == "u":
            id = options["id"][0]
            name = options["name"]
            link = options["link"]
            assert id is not None
            try:
                obj = Extension.objects.get(id=id)
            except Extension.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(
                        f"Extension {id} does not exist."
                    )
                )
                return
            if name is not None:
                obj.name = name
            if link is not None:
                obj.link = link
            obj.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f"update {obj.__str__()}"
                )
            )
        elif mode.lower() == "r":
            self.stdout.write(
                Extension.objects.all().__str__().replace(">,", ">,\n")
            )
        elif mode.lower() == "d":
            ids = options["id"]
            if options["all"]:
                self.stdout.write(
                    self.style.WARNING(
                        f"Delete all user"
                    )
                )
                Extension.objects.all().delete()
                self.stdout.write(
                    Extension.objects.all().__str__()
                )
            else:
                for id in ids:
                    try:
                        user = Extension.objects.filter(id=id)
                        self.stdout.write(
                            self.style.WARNING(
                                f"Delete user: {user}"
                            )
                        )
                        user.delete()
                    except Extension.DoesNotExist:
                        self.stdout.write(
                            self.style.ERROR(
                                f"UserProfile {id} does not exist."
                            )
                        )
        else:
            pass

