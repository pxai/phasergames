import { expect } from "chai";
import { JSDOM } from "jsdom";
import Phaser from "phaser";

const dom = new JSDOM("<!doctype html><html><body><canvas id=\"game\"></canvas></body></html>");
global.document = dom.window.document;
global.window = dom.window;
global.expect = expect;
global.Phaser = Phaser;
