import getpass
from argparse import ArgumentParser
from typing import Any

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import CommandError

from zerver.lib.management import ZulipBaseCommand
from zerver.models import PreregistrationUser

class Command(ZulipBaseCommand):

    help = "curd all prereguser."

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
                PreregistrationUser.objects.all().__str__().replace(">,", ">,\n")
            )
        elif mode.lower() == "d":
            ids = options["id"]
            if options["all"]:
                self.stdout.write(
                    self.style.WARNING(
                        f"Delete all prereguser"
                    )
                )
                PreregistrationUser.objects.all().delete()
                self.stdout.write(
                    PreregistrationUser.objects.all().__str__()
                )
            else:
                for id in ids:
                    try:
                        prereguser = PreregistrationUser.objects.filter(id=id)
                        self.stdout.write(
                            self.style.WARNING(
                                f"Delete prereguser: {prereguser}"
                            )
                        )
                        prereguser.delete()
                    except PreregistrationUser.DoesNotExist:
                        self.stdout.write(
                            self.style.ERROR(
                                f"PreregistrationUser {id} does not exist."
                            )
                        )
        else:
            pass

