// Reference to TypeScript definitions for IntelliSense in VSCode
/// <reference path="../rnode-grpc-gen/js/rnode-grpc-js.d.ts" />
// @ts-check

import grpcLib from "@grpc/grpc-js";
import {
	rhoParToJson,
	getAddrFromPrivateKey,
	getAddrFromPublicKey,
	getAddrFromEth,
	newRevAddress,
	verifyRevAddr,
} from "@tgrospic/rnode-grpc-js";

// Load .env file
import { config } from "dotenv";
config();

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// RNode with environment parameters
import { rnodeService } from "./rnode-env.mjs";

import express from "express";
import bodyParser from "body-parser";
import { assert } from "console";
import { request } from "http";

// RNode connection
const { sendDeploy, getDeployResult, proposeBlock, exploratoryDeploy } =
	rnodeService(process.env, grpcLib);

// Parse command-line arguments
// var host = process.argv[2] ? process.argv[2] : "localhost"
// var port = process.argv[3] ? process.argv[3] : 40401
var uiPort = 40406;

// Configure the express app and RNode connection
var app = express();
app.use(bodyParser.json());
// app.use(express.static(__dirname + "/public"));

// Start the express app
app.listen(uiPort, () => {
	console.log(`started on ${uiPort}`);
});

// @ts-ignore
// app.get("/", (req, res) => {
// 	res.sendFile(__dirname + "/public/hello.html");
// });

function getTablesNames(result) {
	// console.log(result);
	const par = result.postblockdataList[0];
	console.log(par);
	const rhoResult = rhoParToJson(par);
	return rhoResult;
}

app.post("/findAccount", async (req, res) => {
	let val = req.body.name;
	// Account from private key, public key, ETH or REV address
	const fromPriv = getAddrFromPrivateKey(val);
	const fromPub = getAddrFromPublicKey(val);
	const fromEth = getAddrFromEth(val);
	const isRev = verifyRevAddr(val);
	// Render
	if (isRev) {
		console.log(isRev);
	} else if (!!fromPriv) {
		console.log(fromPriv);
	} else if (!!fromPub) {
		console.log(fromPub);
	} else if (!!fromEth) {
		console.log(fromEth);
	}

	res.end();
});

app.post("/checkBalance", async (req, res) => {
	let rhoCode = `new return, rl(\`rho:registry:lookup\`), RevVaultCh, vaultCh in {
    rl!(\`rho:rchain:revVault\`, *RevVaultCh) |
    for (@(_, RevVault) <- RevVaultCh) {
      @RevVault!("findOrCreate", "${req.body.addr}", *vaultCh) |
      for (@maybeVault <- vaultCh) {
        match maybeVault {
          (true, vault) => @vault!("balance", *return)
          (false, err)  => return!(err)
        }
      }
    }
  }`;
	res.header("Access-Control-Allow-Origin", "*");
	let { result } = await exploratoryDeploy({ term: rhoCode });
	// const ret = getTablesNames(result);
	let ret = result.postblockdataList[0].exprsList[0].gInt;
	console.log(ret);
	res.end('"' + ret + '"');
});

app.post("/newAccount", async (req, res) => {
	let { revAddr, ethAddr, pubKey, privKey } = newRevAddress();
	let revAddrFrom = process.env.REV_ADDRESS;
	let revAddrTo = revAddr;
	let amount = 100000000;
	assert(revAddrFrom && revAddrTo && amount, "Missing parameters");

	let rhoCode = `new rl(\`rho:registry:lookup\`), RevVaultCh in {
    rl!(\`rho:rchain:revVault\`, *RevVaultCh) |
    for (@(_, RevVault) <- RevVaultCh) {
    new vaultCh, vaultTo, revVaultkeyCh,
    deployerId(\`rho:rchain:deployerId\`),
    deployId(\`rho:rchain:deployId\`)
    in {
    match ("${revAddrFrom}", "${revAddrTo}", ${amount}) {
    (revAddrFrom, revAddrTo, amount) => {
    @RevVault!("findOrCreate", revAddrFrom, *vaultCh) |
    @RevVault!("findOrCreate", revAddrTo, *vaultTo) |
    @RevVault!("deployerAuthKey", *deployerId, *revVaultkeyCh) |
    for (@vault <- vaultCh; key <- revVaultkeyCh; _ <- vaultTo) {
    match vault {
    (true, vault) => {
    new resultCh in {
    @vault!("transfer", revAddrTo, amount, *key, *resultCh) |
    for (@result <- resultCh) {
    match result {
    (true , _  ) => deployId!((true, "Transfer successful (not yet finalized)."))
    (false, err) => deployId!((false, err))
    }
    }
    }
    }
    err => {
    deployId!((false, "REV vault cannot be found or created."))
    }
    }
    }
    }
    }
    }
    }
    }`;

	const { response: deployResponse, sig } = await sendDeploy({ term: rhoCode });
	console.log({ deployResponse });

	// Propose block
	const proposeResponse = await proposeBlock();
	console.log({ proposeResponse });

	res.header("Access-Control-Allow-Origin", "*");
	console.log({ revAddr, ethAddr, pubKey, privKey });

	res.send({ revAddr, ethAddr, pubKey, privKey });
});

app.post("/deployE", async (req, res) => {
	let rhoCode = req.body.data;
	res.header("Access-Control-Allow-Origin", "*");
	let { result } = await exploratoryDeploy({ term: rhoCode });
	let ret = result.postblockdataList[0].exprsList[0];
	console.log(ret);
	res.send(ret);
});

app.post("/deployP", async (req, res) => {
	let rhoCode = req.body.data;
	res.header("Access-Control-Allow-Origin", "*");
	const { response: deployResponse, sig } = await sendDeploy({ term: rhoCode });
	console.log({ deployResponse });
	// Propose block
	const proposeResponse = await proposeBlock();
	console.log({ proposeResponse });
	res.send({ deployResponse, proposeResponse });
});
