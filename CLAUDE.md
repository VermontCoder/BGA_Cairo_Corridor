## Overview

This is code to implement a game called cairo corridor

## Architecture

The code is written in PHP and Javascript. It accesses a proprietary code library that cannot be seen! When the code runs on the server, it calls this framework. This is true both of the javascript library and the php library.

## Refrences
Framework docs: https://en.doc.boardgamearena.com/Studio_file_reference
	- follow links to get more information.
	
Examples of codebases written for this framework. These can provide examples:
	- https://github.com/elaskavaia/bga-heartsla
	- https://github.com/AntonioSoler/bga-santorini
	- https://github.com/bga-devs/tisaac-boilerplate/ - not a game, but some helper functions a dev created.
	
Rules of game: https://www.tess-elation.co.uk/rulebooks/CAIROCORRIDOR_EN.pdf

## Objective 

In the second move of the game, instead of a normal move, the player should be presented with an option either to change the tile that the first player played to his color or make a normal move. After the second move, play should continue normally. 