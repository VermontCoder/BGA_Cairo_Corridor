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

let color_highlight = {'000000':'888888','ff0000':'ff8888','ffffff':'ffffff'};

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

            }
            alert(':'+gamedatas.current_player_color+':');
            document.querySelector(':root').style.setProperty('--hover_color', '#'.concat(color_highlight[gamedatas.current_player_color]));


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
            
            /* Example:
            
            case 'myGameState':
            
                // Show some HTML block at this game state
                dojo.style( 'my_html_block_id', 'display', 'block' );
                
                break;
           */
           
           
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
            
            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
           
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
/*               
                 Example:
 
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
        
        /* Example:
        
        onMyMethodToCall1: function( evt )
        {
            console.log( 'onMyMethodToCall1' );
            
            // Preventing default browser reaction
            dojo.stopEvent( evt );

            // Check that this action is possible (see "possibleactions" in states.inc.php)
            if( ! this.checkAction( 'myAction' ) )
            {   return; }

            this.ajaxcall( "/cairocorridor/cairocorridor/myAction.html", { 
                                                                    lock: true, 
                                                                    myArgument1: arg1, 
                                                                    myArgument2: arg2,
                                                                    ...
                                                                 }, 
                         this, function( result ) {
                            
                            // What to do after the server call if it succeeded
                            // (most of the time: nothing)
                            
                         }, function( is_error) {

                            // What to do after the server call in anyway (success or failure)
                            // (most of the time: nothing)

                         } );        
        },        
        
        
        */

        onClickSpace: function( evt )
        {
            //console.log( '$$$$ Event : onClickSpace: '+evt.currentTarget.id );
            dojo.stopEvent( evt );

            if( ! this.checkAction( 'claimSpace' ) )
            { return; }
            
            if ( this.isCurrentPlayerActive() ) {
                this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + "claimSpace.html", {
                    space_id : evt.currentTarget.id,
                    lock : true,
                }, this, function(result) {
                }, function(is_error) {
                });
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

            this.color_space(notif.args.space_id,notif.args.color);
            this.disconnect( $(notif.args.space_id), 'onclick');
            
            this.update_scores_and_illegal_spaces(notif.args.scores, notif.args.illegal_spaces);

        },

        // notif_finalScore: function( notif )
	    // {
	    //     console.log( '**** Notification : finalScore' );
	    //     console.log( notif );

	    // },

        update_scores_and_illegal_spaces : function(scores, illegal_spaces)
        {
            this.handle_illegal_spaces(illegal_spaces);
           
            for( var player_id in scores )
            {
                // Update score on screen
                var newScore = scores[ player_id ]['score'];
                if (this.scoreCtrl.length >0 )
                {
                    this.scoreCtrl[ player_id ].toValue( newScore );
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
            new_style = 'fill:#'+color+';cursor:default;';

            if (color == '000000')
            {
                //black outline doesn't show up with black fill, change it
                new_style += 'stroke:#666666;';
            }
            document.getElementById(space_id).setAttributeNS(null,'style',new_style);
        },

        highlight_space : function (space_id)
        {
            orig_style =  document.getElementById(space_id).getAttributeNS(null,'style');
            new_style = orig_style + "stroke:#106AC5;stroke-width:3px;";
            document.getElementById(space_id).setAttributeNS(null,'style',new_style);
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
