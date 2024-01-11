import getpass
from argparse import ArgumentParser
from typing import Any

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import CommandError

from zerver.lib.management import ZulipBaseCommand
from zerver.models import Realm


class Command(ZulipBaseCommand):

    help = "curd all realms."

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("-m", "--mode", required=True, help="CRUD")
        parser.add_argument("--id", required=False, help="selected id, can be a list like: --id 1 2 3", nargs="+", type=int)
        parser.add_argument("--all", required=False, help="select all", action='store_true', default=False)

    def handle(self, *args: Any, **options: Any) -> str:
        mode:str = options["mode"]
        if mode.lower() == "c":
            pass
        elif mode.lower() == "u":
            pass
        elif mode.lower() == "r":
            self.stdout.write(
                Realm.objects.all().__str__().replace(">,", ">,\n")
            )
        elif mode.lower() == "d":
            ids = options["id"]
            ids = options["id"]
            if options["all"]:
                self.stdout.write(
                    self.style.WARNING(
                        f"Delete all realm"
                    )
                )
                Realm.objects.all().delete()
                self.stdout.write(
                    Realm.objects.all().__str__()
                )
            else:
                for id in ids:
                    try:
                        realm = Realm.objects.filter(id=id)
                        self.stdout.write(
                            self.style.WARNING(
                                f"Delete realm: {realm}"
                            )
                        )
                        realm.delete()
                    except Realm.DoesNotExist:
                        self.stdout.write(
                            self.style.ERROR(
                                f"Realm {id} does not exist."
                            )
                        )
        else:
            pass
