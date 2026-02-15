/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * CairoCorridor implementation : © David Felcan dfelcan@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * cairocorridor.js
 *
 * CairoCorridor user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

var color_highlight = {'000000':'888888','ff0000':'ff8888','ffffff':'ffffff'};

var last_move_space_id = null;

var BOARD_SVG = '<svg width="570" height="583.0127018922193">'
    + '<polygon class="pentagon" id="0_0_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(-18.301270189221952,-0.0)"/>'
    + '<polygon class="pentagon" id="0_0_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(18.301270189221952,0.0)"/>'
    + '<polygon class="pentagon" id="0_0_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-0.0,18.301270189221952)"/>'
    + '<polygon class="pentagon" id="0_1_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(0.0,154.90381056766574)"/>'
    + '<polygon class="pentagon" id="0_1_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(154.90381056766574,-0.0)"/>'
    + '<polygon class="pentagon" id="0_1_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-154.90381056766574,0.0)"/>'
    + '<polygon class="pentagon" id="0_1_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-0.0,-154.90381056766574)"/>'
    + '<polygon class="pentagon" id="0_2_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(0.0,328.10889132455344)"/>'
    + '<polygon class="pentagon" id="0_2_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(328.10889132455344,-0.0)"/>'
    + '<polygon class="pentagon" id="0_2_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-328.10889132455344,0.0)"/>'
    + '<polygon class="pentagon" id="0_2_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-0.0,-328.10889132455344)"/>'
    + '<polygon class="pentagon" id="0_3_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(0.0,501.3139720814412)"/>'
    + '<polygon class="pentagon" id="1_0_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-86.60254037844386,104.9038105676658)"/>'
    + '<polygon class="pentagon" id="1_1_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(86.60254037844386,68.3012701892219)"/>'
    + '<polygon class="pentagon" id="1_1_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(68.3012701892219,-86.60254037844386)"/>'
    + '<polygon class="pentagon" id="1_1_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-68.3012701892219,86.60254037844386)"/>'
    + '<polygon class="pentagon" id="1_1_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-86.60254037844386,-68.3012701892219)"/>'
    + '<polygon class="pentagon" id="1_2_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(86.60254037844386,241.5063509461096)"/>'
    + '<polygon class="pentagon" id="1_2_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(241.5063509461096,-86.60254037844386)"/>'
    + '<polygon class="pentagon" id="1_2_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-241.5063509461096,86.60254037844386)"/>'
    + '<polygon class="pentagon" id="1_2_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-86.60254037844386,-241.5063509461096)"/>'
    + '<polygon class="pentagon" id="1_3_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(86.60254037844386,414.7114317029973)"/>'
    + '<polygon class="pentagon" id="1_3_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(414.7114317029973,-86.60254037844386)"/>'
    + '<polygon class="pentagon" id="1_3_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-414.7114317029973,86.60254037844386)"/>'
    + '<polygon class="pentagon" id="2_0_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(-18.301270189221952,-173.20508075688772)"/>'
    + '<polygon class="pentagon" id="2_0_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(18.301270189221952,173.20508075688772)"/>'
    + '<polygon class="pentagon" id="2_0_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-173.20508075688772,18.301270189221952)"/>'
    + '<polygon class="pentagon" id="2_1_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(173.20508075688772,154.90381056766574)"/>'
    + '<polygon class="pentagon" id="2_1_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(154.90381056766574,-173.20508075688772)"/>'
    + '<polygon class="pentagon" id="2_1_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-154.90381056766574,173.20508075688772)"/>'
    + '<polygon class="pentagon" id="2_1_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-173.20508075688772,-154.90381056766574)"/>'
    + '<polygon class="pentagon" id="2_2_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(173.20508075688772,328.10889132455344)"/>'
    + '<polygon class="pentagon" id="2_2_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(328.10889132455344,-173.20508075688772)"/>'
    + '<polygon class="pentagon" id="2_2_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-328.10889132455344,173.20508075688772)"/>'
    + '<polygon class="pentagon" id="2_2_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-173.20508075688772,-328.10889132455344)"/>'
    + '<polygon class="pentagon" id="2_3_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(173.20508075688772,501.3139720814412)"/>'
    + '<polygon class="pentagon" id="3_0_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-259.8076211353316,104.9038105676658)"/>'
    + '<polygon class="pentagon" id="3_1_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(259.8076211353316,68.3012701892219)"/>'
    + '<polygon class="pentagon" id="3_1_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(68.3012701892219,-259.8076211353316)"/>'
    + '<polygon class="pentagon" id="3_1_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-68.3012701892219,259.8076211353316)"/>'
    + '<polygon class="pentagon" id="3_1_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-259.8076211353316,-68.3012701892219)"/>'
    + '<polygon class="pentagon" id="3_2_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(259.8076211353316,241.5063509461096)"/>'
    + '<polygon class="pentagon" id="3_2_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(241.5063509461096,-259.8076211353316)"/>'
    + '<polygon class="pentagon" id="3_2_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-241.5063509461096,259.8076211353316)"/>'
    + '<polygon class="pentagon" id="3_2_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-259.8076211353316,-241.5063509461096)"/>'
    + '<polygon class="pentagon" id="3_3_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(259.8076211353316,414.7114317029973)"/>'
    + '<polygon class="pentagon" id="3_3_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(414.7114317029973,-259.8076211353316)"/>'
    + '<polygon class="pentagon" id="3_3_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-414.7114317029973,259.8076211353316)"/>'
    + '<polygon class="pentagon" id="4_0_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(-18.301270189221952,-346.41016151377545)"/>'
    + '<polygon class="pentagon" id="4_0_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(18.301270189221952,346.41016151377545)"/>'
    + '<polygon class="pentagon" id="4_0_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-346.41016151377545,18.301270189221952)"/>'
    + '<polygon class="pentagon" id="4_1_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(346.41016151377545,154.90381056766574)"/>'
    + '<polygon class="pentagon" id="4_1_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(154.90381056766574,-346.41016151377545)"/>'
    + '<polygon class="pentagon" id="4_1_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-154.90381056766574,346.41016151377545)"/>'
    + '<polygon class="pentagon" id="4_1_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-346.41016151377545,-154.90381056766574)"/>'
    + '<polygon class="pentagon" id="4_2_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(346.41016151377545,328.10889132455344)"/>'
    + '<polygon class="pentagon" id="4_2_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(328.10889132455344,-346.41016151377545)"/>'
    + '<polygon class="pentagon" id="4_2_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-328.10889132455344,346.41016151377545)"/>'
    + '<polygon class="pentagon" id="4_2_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-346.41016151377545,-328.10889132455344)"/>'
    + '<polygon class="pentagon" id="4_3_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(346.41016151377545,501.3139720814412)"/>'
    + '<polygon class="pentagon" id="5_0_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-433.0127018922193,104.9038105676658)"/>'
    + '<polygon class="pentagon" id="5_1_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(433.0127018922193,68.3012701892219)"/>'
    + '<polygon class="pentagon" id="5_1_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(68.3012701892219,-433.0127018922193)"/>'
    + '<polygon class="pentagon" id="5_1_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-68.3012701892219,433.0127018922193)"/>'
    + '<polygon class="pentagon" id="5_1_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-433.0127018922193,-68.3012701892219)"/>'
    + '<polygon class="pentagon" id="5_2_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(433.0127018922193,241.5063509461096)"/>'
    + '<polygon class="pentagon" id="5_2_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(241.5063509461096,-433.0127018922193)"/>'
    + '<polygon class="pentagon" id="5_2_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-241.5063509461096,433.0127018922193)"/>'
    + '<polygon class="pentagon" id="5_2_3" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(180,68.30127018922192,86.60254037844385) translate(-433.0127018922193,-241.5063509461096)"/>'
    + '<polygon class="pentagon" id="5_3_0" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform= " translate(433.0127018922193,414.7114317029973)"/>'
    + '<polygon class="pentagon" id="5_3_1" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(90,24.999999999999996,43.30127018922193) translate(414.7114317029973,-433.0127018922193)"/>'
    + '<polygon class="pentagon" id="5_3_2" points="49.99999999999999,0 86.60254037844386,0 111.60254037844386,43.30127018922193 68.30127018922192,68.30127018922192 24.999999999999996,43.30127018922193 " transform="rotate(-90,111.60254037844386,43.30127018922193) translate(-414.7114317029973,433.0127018922193)"/>'
    + '</svg>';

define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter"
],
function (dojo, declare) {
    return declare("bgagame.cairocorridor", ebg.core.gamegui, {
        constructor: function(){
            //console.log('cairocorridor constructor');
              
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;
            this.clientStateArgs = {};

        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function( gamedatas )
        {
            //console.log( "Starting game setup" );

            // Insert game board template
            var boardHtml = '<div id="board_container">'
                + '<div id="tooltip" style="position: absolute; display: none;"></div>'
                + BOARD_SVG
                + '</div>';
            this.bga.gameArea.getElement().insertAdjacentHTML('beforeend', boardHtml);

            // Setting up player boards
            // for( var player_id in gamedatas.players )
            // {
            //     var player = gamedatas.players[player_id];
            //     //console.log(JSON.stringify(player))
                         
            //     // TODO: Setting up players boards if needed
            // }
            
            // TODO: Set up your game interface here, according to "gamedatas"

            for( var space_id in gamedatas.board )
            {
                var space = gamedatas.board[space_id];
                if (space.owner != null)
                {
                    owner_color = gamedatas.players[space.owner]["color"];
                    this.color_space(space_id,owner_color);
                }
                else
                {
                    this.connect( $(space_id), 'onclick','onClickSpace');
                }

                //show the space ID, if user preference is yes
                if (this.getGameUserPreference(101) == 1)
                {
                    this.connect( $(space_id), 'onmousemove','showSpaceID');
                    this.connect( $(space_id), 'onmouseout','hideSpaceID');
                }
            }
            
            document.querySelector(':root').style.setProperty('--hover_color', '#'.concat(color_highlight[gamedatas.current_player_color]));

            //highlight last move
            if (gamedatas.last_move_space_id != null)
            {
                var owner_color = gamedatas.players[gamedatas.board[gamedatas.last_move_space_id].owner]["color"];
                this.color_space(gamedatas.last_move_space_id,color_highlight[owner_color]);
                
                //set the global javascript variable for use
                last_move_space_id = gamedatas.last_move_space_id;
            }

            this.update_scores_and_illegal_spaces(gamedatas.scores, gamedatas.illegal_spaces);
            
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            //console.log( "Ending game setup" );
        },
       

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            //console.log( 'Entering state: '+stateName );
            
            switch( stateName )
            {
            case 'swapDecision':
                if (this.isCurrentPlayerActive() && args.args) {
                    this.highlight_space(args.args.swap_space_id);
                }
                break;

            case 'dummmy':
                break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            //console.log( 'Leaving state: '+stateName );
            
            switch( stateName )
            {
            case 'dummmy':
                break;
            }
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            //console.log( 'onUpdateActionButtons: '+stateName );
                      
            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName )
                {
              
                    case 'swapDecision':
                        this.addActionButton('button_swap', _('Swap tile'), 'onSwapTile', null, false, 'red');
                        this.addActionButton('button_decline', _('Play normally'), 'onDeclineSwap');
                    break;

                    case 'client_claimSpace':
                        if (this.on_client_state && !$('button_confirm')) 
                        {
                            this.addActionButton('button_confirm', _('Confirm'), dojo.hitch(this, this.send_move_to_server));
                        }

                        if (this.on_client_state && !$('button_cancel')) {
                            this.addActionButton('button_cancel', _('Cancel'), dojo.hitch(this, function() {
                                            this.clear_space_style(this.clientStateArgs.space_id); //must clear, not assign ffffff because that would negate hover coloring.
                                            this.restoreServerGameState();
                        }));
                        }
                    break;
             /*     Example:
 
                 case 'myGameState':
                    
                    // Add 3 action buttons in the action status bar:
                    
                    this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' ); 
                    this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' ); 
                    this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' ); 
                    break;
*/
                }
            }
        },        

        send_move_to_server: function()
        {
            this.bga.actions.performAction('claimSpace', {
                space_id : this.clientStateArgs.space_id,
            });
        },

        onSwapTile: function()
        {
            this.bga.actions.performAction('swapTile');
        },

        onDeclineSwap: function()
        {
            this.bga.actions.performAction('declineSwap');
        },
        ///////////////////////////////////////////////////
        //// Utility methods
        
        /*
        
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        
        */


        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */
        

        onClickSpace: function( evt )
        {
            //console.log( '$$$$ Event : onClickSpace: '+evt.currentTarget.id );
            dojo.stopEvent( evt );

            if( ! this.checkAction( 'claimSpace' ) )
            { return; }

            //if we are in a confirm state do not respond to the click.
            if ($('button_confirm'))
            { return; }

            if ( this.isCurrentPlayerActive() ) {

                cur_color = document.querySelector(':root').style.getPropertyValue('--hover_color');
                this.color_space(evt.currentTarget.id, cur_color);

                this.clientStateArgs.space_id = evt.currentTarget.id;
                
                //if confirm button is active
                if (this.getGameUserPreference(100) == 1)
                {
                    this.setClientState("client_claimSpace", {
                        descriptionmyturn : _("${you} must confirm."),
                    });
                }
                else
                {
                    this.send_move_to_server();
                }
            }
        },
        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your cairocorridor.game.php file.
        
        */
        setupNotifications: function()
        {
            //console.log( 'notifications subscriptions setup' );
            dojo.subscribe( 'claimSpace', this, "notif_claimSpace" );
            dojo.subscribe( 'swapTile', this, "notif_swapTile" );
            this.notifqueue.setSynchronous( 'swapTile', 1000 );
            //dojo.subscribe( 'finalScore', this, "notif_finalScore" );
	        //this.notifqueue.setSynchronous( 'finalScore', 1500 );
            
            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
        },  
        
        notif_claimSpace: function(notif)
        {
            
            //Test Adjacency Code
            // for (let i=0; i < notif.args.adjacency.length; i++) {
            //     this.flash_space(notif.args.adjacency[i]);
            // }
            // this.flash_space(notif.args.space_id);

            if (last_move_space_id != null)
            {
                //change the previous last move color appropriately.
                //it will be the color of the opponent's last move
                this.color_space(last_move_space_id, notif.args.color == '000000' ? 'ff0000' : '000000')
            }

            last_move_space_id = notif.args.space_id;
            this.color_space(notif.args.space_id,color_highlight[notif.args.color]);
            this.disconnect( $(notif.args.space_id), 'onclick');
            
            this.update_scores_and_illegal_spaces(notif.args.scores, notif.args.illegal_spaces);

        },

        notif_swapTile: function(notif)
        {
            // Recolor the swapped space to the new owner's color
            this.color_space(notif.args.space_id, color_highlight[notif.args.color]);
            last_move_space_id = notif.args.space_id;

            this.update_scores_and_illegal_spaces(notif.args.scores, notif.args.illegal_spaces);
        },

        update_scores_and_illegal_spaces : function(scores, illegal_spaces)
        {
            this.handle_illegal_spaces(illegal_spaces);
           
            for( var player_id in scores )
            {
                // Update score on screen
                var newScore = scores[ player_id ]['score'];
                var scoreCtrl = this.bga.playerPanels.getScoreCounter(player_id);
                if (scoreCtrl )
                {
                    scoreCtrl.toValue( newScore );
                }

                //highlight_scoring spaces
                //this comes in as a key-value pair
                var player_spaces = Object.values(scores[ player_id]['score_spaces']);
                this.handle_scoring_spaces(player_spaces);
            }
        },

       

        //properly render spaces which are illegal to play on - will be part of the final corridor by default.
        handle_illegal_spaces(space_ids)
        {
            for (var idx=0; idx < space_ids.length; idx++)
            {
                var cur_illegal_space = space_ids[idx];
                this.color_space(cur_illegal_space,"fce57e");
                this.disconnect( $(cur_illegal_space), 'onclick');
            }
        },

        //properly render spaces which are used for scoring.
        handle_scoring_spaces(space_ids)
        {
            for (var idx =0; idx < space_ids.length; idx++)
            {
                this.highlight_space(space_ids[idx]);
            }
        },

        color_space(space_id, color)
        {
            //quick check for front #
            color = color.charAt(0) !='#' ? '#'+color : color;

            new_style = 'fill:'+color+';cursor:default;';

            if (color == '#000000')
            {
                //black outline doesn't show up with black fill, change it
                new_style += 'stroke:#666666;';
            }
            document.getElementById(space_id).setAttributeNS(null,'style',new_style);
        },

        clear_space_style: function (space_id)
        {
            document.getElementById(space_id).setAttributeNS(null,'style','');
        },

        highlight_space : function (space_id)
        {
            orig_style =  document.getElementById(space_id).getAttributeNS(null,'style');
            new_style = orig_style + "stroke:#106AC5;stroke-width:3px;";
            document.getElementById(space_id).setAttributeNS(null,'style',new_style);
        },

        showSpaceID: function(evt) 
        {
            let tooltip = document.getElementById("tooltip");
            tooltip.innerHTML = "Space ID: " + evt.target.id;
            tooltip.style.display = "block";

        },
          
        hideSpaceID : function() {
            var tooltip = document.getElementById("tooltip");
            tooltip.style.display = "none";
        }
        // flash_space(space_id)
        // {
        //     orig_style =  document.getElementById(space_id).getAttributeNS(null,'style');
        //     console.debug(orig_style);
        //     document.getElementById(space_id).setAttributeNS(null,'style','fill:#888888;cursor:default;');
        //     setTimeout(function(orig) {
        //         document.getElementById(space_id).setAttributeNS(null,'style',orig);
        //          }, 2000, orig_style);
        // }
        // TODO: from this point and below, you can write your game notifications handling methods
        
        /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        
        */
   });             
});
