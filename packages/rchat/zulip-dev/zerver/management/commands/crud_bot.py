import getpass
from argparse import ArgumentParser
from typing import Any

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import CommandError

from zerver.lib.management import ZulipBaseCommand
from zerver.models import UserProfile
from zerver.lib.server_initialization import create_internal_bot

class Command(ZulipBaseCommand):

    help = "curd all bot."

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("-m", "--mode", required=True, help="CRUD")
        parser.add_argument("--name", required=False, type=str)
        parser.add_argument("--email", required=False, type=str)

    def handle(self, *args: Any, **options: Any) -> str:
        mode:str = options["mode"]
        if mode.lower() == "c":
            name = options["name"]
            email = options["email"]
            bot = {
                "name": name,
                "email": email,
            }
            create_internal_bot(bot)
            self.stdout.write(
                UserProfile.objects.all().__str__().replace(">,", ">,\n")
            )
        elif mode.lower() == "u":
            pass
        elif mode.lower() == "r":
            pass
        elif mode.lower() == "d":
            pass
        else:
            pass

