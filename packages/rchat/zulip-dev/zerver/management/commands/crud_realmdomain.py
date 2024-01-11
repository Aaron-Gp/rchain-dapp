import getpass
from argparse import ArgumentParser
from typing import Any

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import CommandError

from zerver.lib.management import ZulipBaseCommand
from zerver.models import RealmDomain


class Command(ZulipBaseCommand):

    help = "curd all realm domain."

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("-m", "--mode", required=True, help="CRUD")

    def handle(self, *args: Any, **options: Any) -> str:
        mode:str = options["mode"]
        if mode.lower() == "c":
            pass
        elif mode.lower() == "u":
            pass
        elif mode.lower() == "r":
            self.stdout.write(
                RealmDomain.objects.all().__str__().replace(">,", ">,\n")
            )
        elif mode.lower() == "d":
            pass
        else:
            pass
