<?php
 /**
  *------
  * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
  * CairoCorridor implementation : © David Felcan dfelcan@gmail.com
  * 
  * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
  * See http://en.boardgamearena.com/#!doc/Studio for more information.
  * -----
  * 
  * cairocorridor.game.php
  *
  * This is the main file for your game logic.
  *
  * In this PHP file, you are going to defines the rules of the game.
  *
  */


class CairoCorridor extends Bga\GameFramework\Table
{	
    function __construct( )
	{
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();
        
        self::initGameStateLabels( array(
            "end_of_game" => 10,
        ) );
        
       
	}	

    /*
        setupNewGame:
        
        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame( $players, $options = array() )
    {    
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = $this->getGameinfos();
        $default_colors = $gameinfos['player_colors'];

        self::setGameStateInitialValue( 'end_of_game', 0 ); //initialize end of game variable
         
        //new way to do globals
        $this->globals->set('last_move_space_id',null);
        $this->globals->set('swap_decided', false);
        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach( $players as $player_id => $player )
        {
            $color = array_shift( $default_colors );
            $values[] = "('".$player_id."','$color','".$player['player_canal']."','".addslashes( $player['player_name'] )."','".addslashes( $player['player_avatar'] )."')";
        }
        $sql .= implode( ',', $values );
        $this->DbQuery( $sql );
        //Stick with black and red

        //$this->reattributeColorsBasedOnPreferences( $players, $gameinfos['player_colors'] );
        $this->reloadPlayersBasicInfos();
        
        /************ Start the game initialization *****/

        $sql = "INSERT INTO `board` (`space_id`, `owner`) VALUES 
            ('0_0_1', NULL), 
            ('0_0_2', NULL), 
            ('0_0_3', NULL),
            ('0_1_0', NULL),
            ('0_1_1', NULL),
            ('0_1_2', NULL),
            ('0_1_3', NULL),
            ('0_2_0', NULL),
            ('0_2_1', NULL),
            ('0_2_2', NULL),
            ('0_2_3', NULL),
            ('0_3_0', NULL),
            ('1_0_3', NULL),
            ('1_1_0', NULL),
            ('1_1_1', NULL),
            ('1_1_2', NULL),
            ('1_1_3', NULL),
            ('1_2_0', NULL),
            ('1_2_1', NULL),
            ('1_2_2', NULL),
            ('1_2_3', NULL),
            ('1_3_0', NULL),
            ('1_3_1', NULL),
            ('1_3_2', NULL),
            ('2_0_1', NULL),
            ('2_0_2', NULL),
            ('2_0_3', NULL),
            ('2_1_0', NULL),
            ('2_1_1', NULL),
            ('2_1_2', NULL),
            ('2_1_3', NULL),
            ('2_2_0', NULL),
            ('2_2_1', NULL),
            ('2_2_2', NULL),
            ('2_2_3', NULL),
            ('2_3_0', NULL),
            ('3_0_3', NULL),
            ('3_1_0', NULL),
            ('3_1_1', NULL),
            ('3_1_2', NULL),
            ('3_1_3', NULL),
            ('3_2_0', NULL),
            ('3_2_1', NULL),
            ('3_2_2', NULL),
            ('3_2_3', NULL),
            ('3_3_0', NULL),
            ('3_3_1', NULL),
            ('3_3_2', NULL),
            ('4_0_1', NULL),
            ('4_0_2', NULL),
            ('4_0_3', NULL),
            ('4_1_0', NULL),
            ('4_1_1', NULL),
            ('4_1_2', NULL),
            ('4_1_3', NULL),
            ('4_2_0', NULL),
            ('4_2_1', NULL),
            ('4_2_2', NULL),
            ('4_2_3', NULL),
            ('4_3_0', NULL),
            ('5_0_3', NULL),
            ('5_1_0', NULL),
            ('5_1_1', NULL),
            ('5_1_2', NULL),
            ('5_1_3', NULL),
            ('5_2_0', NULL),
            ('5_2_1', NULL),
            ('5_2_2', NULL),
            ('5_2_3', NULL),
            ('5_3_0', NULL),
            ('5_3_1', NULL),
            ('5_3_2', NULL)";
        
        self::DbQuery( $sql );

        // Init global values with their initial values
        //$this->setGameStateInitialValue( 'my_first_global_variable', 0 );
        
        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        $this->initStat( 'table', 'turns_number', 0 );
        $this->initStat( 'table', 'length_of_corridor', 0 );
        $this->initStat( 'table', 'empty_non_corridor', 0 );  

        // TODO: setup the initial game situation here
       

        // Activate first player (which is in general a good idea :) )
        $this->activeNextPlayer();

        /************ End of the game initialization *****/

        return 2;
    }

    /*
        getAllDatas: 
        
        Gather all informations about current game situation (visible by the current player).
        
        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas()
    {
        $result = array();
    
        $current_player_id = $this->getCurrentPlayerId();
    
        // Get information about players
        // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
        // Note: player_score score is used by scoreCtrl so don't mess with it.
        $sql = "SELECT player_id id, player_score score, player_no, player_name name, player_color color FROM player ";
        $players = $this->getCollectionFromDb( $sql );


        //check if spectator to set current player color
        
        $current_player_color = (!$this->isSpectator()) ? $players[$current_player_id]['color'] : 'ffffff';

        // self::trace( var_dump($players) );

        $sql ="SELECT space_id,owner FROM `board`";
        $board = $this->getCollectionFromDb( $sql );
  
        //populate array with only space_ids that are filled
        $filled_array = $this->get_filled_array(($board));

        //find all illegal moves and send them back to the client to be represented on the gameboard
        $illegal_spaces = $this->get_illegal_spaces($filled_array);

        //based on these illegal moves, find and designate scoring pentagons. Record and send score along with the move.
        $score_spaces = $this->score_game($illegal_spaces,$board);

        $scores = [];
        foreach(array_keys($players) as $player_id)
        {
            $score = count($score_spaces[$player_id]);
            $scores[$player_id] = array('player_id' => $player_id, 'score'=>$score, 'score_spaces'=>$score_spaces[$player_id]);
        }

        //Package and send it

        $result['players'] = $players;
        $result['board'] = $board;
        $result['illegal_spaces'] = $illegal_spaces;
        $result['scores'] = $scores;
        $result['current_player_color'] = $current_player_color;
        $result['last_move_space_id'] = $this->globals->get('last_move_space_id');

        return $result;
    }

    /*
        getGameProgression:
        
        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).
    
        This method is called each time we are in a game state with the "updateGameProgression" property set to true 
        (see states.inc.php)
    */
    function getGameProgression()
    {
        // TODO: compute and return the game progression

        //It is hard to say how far the game has progressed. The longest corridor is 34 spaces, so I'm guessing that would have every other space filled.
        // so 72-34

        $MAX_SPACES_FILLED =38;

        $sql ="SELECT space_id,owner FROM `board`";
        $board = $this->getCollectionFromDb( $sql );

        $filled_array = $this->get_filled_array(($board));

        if ($this->is_endgame( $filled_array ))
        {
            return 100; //100% game done
        }
        $percent_done = 100*count($filled_array)/$MAX_SPACES_FILLED;
        return ($percent_done <= 100) ? $percent_done : 100; //never send more than 100.
    
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
////////////    

    /*
        In this space, you can put any utility methods useful for your game logic
    */



//////////////////////////////////////////////////////////////////////////////
//////////// Player actions
//////////// 

function claimSpace($space_id)
{
    $this->checkAction( 'claimSpace' ); 
    
    //Check not already played
    $sql ="SELECT space_id,owner FROM `board`";
    $board = $this->getCollectionFromDb( $sql );
    
    if ($board[$space_id]['owner'] != null)
    {
        throw new BgaUserException( clienttranslate("This space has already been played!") );
    }

    //populate array with only space_ids that are filled
    $filled_array = $this->get_filled_array($board);

    //add the clicked space
    $filled_array[] = $space_id;

    if (!$this->is_legal_gameboard($filled_array))
    {
        throw new BgaUserException( clienttranslate("This move would eliminate the corridor!") );
    }

    $player_id = $this->getActivePlayerId();

    // Get player color
    $sql = "SELECT player_id, player_color FROM player WHERE player_id = $player_id";
    $player = self::getNonEmptyObjectFromDb( $sql );

    //record move in database
    $sql = "UPDATE `board` SET `owner`= $player_id WHERE space_id='$space_id'";
    self::DbQuery($sql);

    //change board variable to reflect database change
    $board[$space_id]['owner'] = $player_id;

    //find all illegal moves and send them back to the client to be represented on the gameboard
    $illegal_spaces = $this->get_illegal_spaces($filled_array);

    //based on these illegal moves, find and designate scoring pentagons. Record and send score along with the move.
    $score_spaces = $this->score_game($illegal_spaces,$board);
    
    $players =  $this->loadPlayersBasicInfos();

    
    $scores = [];
    foreach(array_keys($players) as $player_id)
    {
        $score = count($score_spaces[$player_id]);
        $scores[$player_id] = array('player_id' => $player_id, 'score'=>$score, 'score_spaces'=>$score_spaces[$player_id]);
        $this->bga->playerScore->set($player_id, $score);
    }

    //save this space so we can highlight last move on game refresh
    $this->globals->set('last_move_space_id', $space_id);
    
    $this->notifyAllPlayers( "claimSpace", clienttranslate( '${player_name} claims ${space_id}' ), array(
        'player_id' => $player_id,
        'player_name' => $this->getActivePlayerName(),
        'color' =>$player['player_color'],
        //'adjacency' => $this->adjacency_graph[$space_id],
        'space_id' => $space_id,
        'illegal_spaces' => $illegal_spaces,
        'scores' => $scores,
    ) );

    if ($this->is_endgame( $filled_array )) {
        
        //determine winning player and resolve ties.
        $max_score =0;
        $winning_player_id = 0;

        foreach(array_keys($players) as $player_id)
        {
            $tiebreaker = ($player_id == $this->getActivePlayerId()) ? 0 : 1;
            $score = $scores[$player_id]['score'];

            if ($score > $max_score)
            {
                $max_score = $score;
                $winning_player_id = $player_id;
            }
            else if ($score == $max_score)
            {
                //This is a tie score. This is the the winning player if this is NOT the active player.
                if ($tiebreaker == 1)
                {
                    $winning_player_id = $player_id;
                }
            }

            $this->bga->playerScoreAux->set($player_id, $tiebreaker);
        }

        // Notify final score
        $this->notifyAllPlayers( "message",
                    clienttranslate( '${player_name} wins the game!' ),
                    array(
                            "player_name" => $players[$winning_player_id]['player_name'],
                    )
           );

        // Set global variable flag to pass on the information that the game has ended
        self::setGameStateValue('end_of_game', 1);

        // End of game message
        $this->notifyAllPlayers( "message",
                clienttranslate('Thanks for playing!'),
                array(
                )
        );

    }
    // Go to next game state
    $this->gamestate->nextState( "claimSpace" );
}

function swapTile()
{
    $this->checkAction('swapTile');

    $player_id = $this->getActivePlayerId();

    // Get the single filled space
    $sql = "SELECT space_id, owner FROM `board` WHERE owner IS NOT NULL";
    $filled = $this->getCollectionFromDb($sql);
    $space = array_values($filled)[0];
    $space_id = $space['space_id'];

    // Get player color
    $sql = "SELECT player_id, player_color FROM player WHERE player_id = $player_id";
    $player = self::getNonEmptyObjectFromDb($sql);

    // Change owner to the current (swapping) player
    $sql = "UPDATE `board` SET `owner` = $player_id WHERE space_id = '$space_id'";
    self::DbQuery($sql);

    // Recalculate board state
    $sql = "SELECT space_id, owner FROM `board`";
    $board = $this->getCollectionFromDb($sql);
    $filled_array = $this->get_filled_array($board);
    $illegal_spaces = $this->get_illegal_spaces($filled_array);
    $score_spaces = $this->score_game($illegal_spaces, $board);

    $players = $this->loadPlayersBasicInfos();
    $scores = [];
    foreach (array_keys($players) as $pid) {
        $score = count($score_spaces[$pid]);
        $scores[$pid] = array('player_id' => $pid, 'score' => $score, 'score_spaces' => $score_spaces[$pid]);
        $this->bga->playerScore->set($pid, $score);
    }

    // Save last move
    $this->globals->set('last_move_space_id', $space_id);

    $this->globals->set('swap_decided', true);

    $this->notifyAllPlayers("swapTile", clienttranslate('${player_name} swaps the first tile'), array(
        'player_id' => $player_id,
        'player_name' => $this->getActivePlayerName(),
        'color' => $player['player_color'],
        'space_id' => $space_id,
        'illegal_spaces' => $illegal_spaces,
        'scores' => $scores,
    ));

    $this->gamestate->nextState("swapTile");
}

function declineSwap()
{
    $this->checkAction('declineSwap');

    $this->globals->set('swap_decided', true);

    $this->notifyAllPlayers("message", clienttranslate('${player_name} declines to swap'), array(
        'player_name' => $this->getActivePlayerName(),
    ));

    $this->gamestate->nextState("declineSwap");
}

    /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in cairocorridor.action.php)
    */

    /*
    
    Example:

    function playCard( $card_id )
    {
        // Check that this is the player's turn and that it is a "possible action" at this game state (see states.inc.php)
        $this->checkAction( 'playCard' ); 
        
        $player_id = $this->getActivePlayerId();
        
        // Add your game logic to play a card there 
        ...
        
        // Notify all players about the card played
        $this->notifyAllPlayers( "cardPlayed", clienttranslate( '${player_name} plays ${card_name}' ), array(
            'player_id' => $player_id,
            'player_name' => $this->getActivePlayerName(),
            'card_name' => $card_name,
            'card_id' => $card_id
        ) );
          
    }
    
    */

    
//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

    function argSwapDecision()
    {
        $sql = "SELECT space_id, owner FROM `board` WHERE owner IS NOT NULL";
        $filled = $this->getCollectionFromDb($sql);
        $space = array_values($filled)[0];
        return array(
            'swap_space_id' => $space['space_id'],
            'swap_space_owner' => $space['owner'],
        );
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////


function stNextPlayer()
{
    //self::trace( "stNextPlayer" );

    // Go to next player
    $active_player = self::activeNextPlayer();
    self::giveExtraTime( $active_player );

    // Check if this is the swap turn (exactly 1 space filled and swap not yet decided)
    $sql = "SELECT COUNT(*) AS cnt FROM `board` WHERE owner IS NOT NULL";
    $count = $this->getUniqueValueFromDB($sql);

    if ($count == 1 && !$this->globals->get('swap_decided')) {
        $this->gamestate->nextState("swapTurn");
    } else {
        $this->gamestate->nextState("normalTurn");
    }
}

function stCheckEndOfGame()
{
    //self::trace('stCheckEndOfGame');

    // If the 'end of game' flag has been set, end the game
    $transition = 'notEndedYet';

    if (self::getGameStateValue('end_of_game') == 1)
    {
         //make next state end of game
         $transition = 'gameEnded';

        //Calculate statistics
        $sql ="SELECT space_id,owner FROM `board`";
        $board = $this->getCollectionFromDb( $sql );

        $filled_array = [];
        $num_empty_spaces = 0;
        $num_turns = 0;
        foreach ($board as $space)
        {
            if ($space['owner'] != null)
            {
                $filled_array[] = $space['space_id'];
                $num_turns++;
            }
            else
            {
                $num_empty_spaces++;
            }
        }

        list($groups,$corridor_group_id) = $this->get_corridor_group_and_id($filled_array);
        $length_of_corridor = count($groups[$corridor_group_id]);
        $num_empty_spaces -= $length_of_corridor; //looking for empty, non-corridor spaces

        //Record statistics
        $this->setStat( $num_turns, 'turns_number' );
        $this->setStat( $length_of_corridor, 'length_of_corridor' );
        $this->setStat( $num_empty_spaces, 'empty_non_corridor' );

       
    }
    //"do not end game" debug code
    // if ($this->getBgaEnvironment() == 'studio')
    // {
    //     $transition = 'notEndedYet';
    // }

    $this->gamestate->nextState($transition);
}

    
    /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */
    
    /*
    
    Example for game state "MyGameState":

    function stMyGameState()
    {
        // Do some stuff ...
        
        // (very often) go to another gamestate
        $this->gamestate->nextState( 'some_gamestate_transition' );
    }    
    */

//////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

    /*
        zombieTurn:
        
        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).
        
        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message. 
    */

    function zombieTurn( $state, $active_player )
    {
    	$statename = $state['name'];
    	
        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                case 'swapDecision':
                    // Zombie auto-declines the swap
                    $this->gamestate->nextState( "declineSwap" );
                    break;
                default:
                    $this->gamestate->nextState( "zombiePass" );
                	break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive( $active_player, '' );
            
            return;
        }

        throw new feException( "Zombie mode not supported at this game state: ".$statename );
    }
    
///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
        upgradeTableDb:
        
        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.
    
    */
    
    function upgradeTableDb( $from_version )
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345
        
        // Example:
//        if( $from_version <= 1404301345 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            $this->applyDbUpgradeToAllDB( $sql );
//        }
//        if( $from_version <= 1405061421 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            $this->applyDbUpgradeToAllDB( $sql );
//        }
//        // Please add your future database scheme changes here
//
    $this->applyDbUpgradeToAllDB("CREATE TABLE IF NOT EXISTS `bga_globals` (`name` varchar(50) NOT NULL, `value` json, PRIMARY KEY (`name`)) ENGINE=InnoDB DEFAULT CHARSET=utf8");

    }
///// GAME LOGIC FUNCTIONS

    function add_space_to_group($cur_space, $cur_group,& $groups,& $adjacency_graph)
    {
      if (!array_key_exists($cur_space,$adjacency_graph))
      {
        //this space has already been accounted for
        return;
      }

      $groups[$cur_group][] = $cur_space;

      if (count($groups[$cur_group])>72)
      {
        //escape valve to prevent infinite loops
        return;
      }

      //copy adjacency array and then delete it from the adjacency graph
      //copies are made automagically in PHP :P

      $cur_space_adjacency = $adjacency_graph[$cur_space];
      unset($adjacency_graph[$cur_space]);
      
      foreach ($cur_space_adjacency as $adjacency)
      {
        if (array_key_exists($adjacency,$adjacency_graph))
        {
            $this->add_space_to_group($adjacency, $cur_group,$groups,$adjacency_graph);
        }
      }
    }

    function do_groups($filled_array)
    {

       //calculate groups
      
      //initialize working arrays
      //copy full adjacency graph to have working copy
      $adjacency_graph = $this->adjacency_graph;
      $groups = [];

      //remove already selected spaces from adjacency_graph
      foreach($filled_array as $selected_space)
      {
        unset($adjacency_graph[$selected_space]);
      }
      
      $cur_group = 0; 
      while (count($adjacency_graph) >0)
      {
        //get next unassigned space
        $cur_space = array_key_first($adjacency_graph);
        $this->add_space_to_group($cur_space, $cur_group,$groups,$adjacency_graph);
        $cur_group += 1;

        $groups[] = [];
      }
      //remove trailing empty group
      unset($groups[$cur_group]);
      return $groups;
    }

    function is_endgame( $filled_array)
    {
        list($groups,$corridor_group_id) = $this->get_corridor_group_and_id($filled_array);

        //check that there are no more legal moves in the corridor - if that is the case, game is over.
        foreach ($groups[$corridor_group_id] as $id)
        {
            list($new_groups,$corridor_group_id) = $this->get_corridor_group_and_id(array_merge($filled_array,array($id)));
            
            if ($corridor_group_id > -1)
            {
                //this move is legal, so there is still more of the game
                return false;
            }
        }

        //Game is Over!
        return true;
    }

    function get_corridor_group($groups)
    {
      //returns index of corridor group or -1 if there is none.
      //assumes $groups variable has already been calculated.

      //corridor group will have a space or spaces on all four sides of the playing field.

      $top_row =  array('0_0_1','0_0_2','1_0_3','2_0_1','2_0_2','3_0_3','4_0_1','4_0_2','5_0_3');
      $bottom_row = array('0_3_0','1_3_1','1_3_2','2_3_0','3_3_1','3_3_2','4_3_0','5_3_1','5_3_2');
      $left_col = array('0_0_1','0_0_3','0_1_0','0_1_1','0_1_3','0_2_0','0_2_1','0_2_3','0_3_0');
      $right_col = array('5_0_3','5_1_0','5_1_2','5_1_3','5_2_0','5_2_2','5_2_3','5_3_0','5_3_2');

      for($cur_idx =0; $cur_idx < count($groups); $cur_idx++)
      {
        $has_top = count(array_intersect($groups[$cur_idx],$top_row)) > 0;
        $has_bottom = count(array_intersect($groups[$cur_idx],$bottom_row)) > 0;
        $has_left = count(array_intersect($groups[$cur_idx],$left_col)) > 0;
        $has_right = count(array_intersect($groups[$cur_idx],$right_col)) > 0;

        if ($has_top && $has_bottom && $has_left && $has_right)
        {
          //found it
          return $cur_idx;
        }
      }
      //no corridor group
      return -1;
    }
    
    function is_legal_gameboard($filled_array)
    {
        //$filled_array contains space_ids filled previously + the new move

        list($groups,$corridor_group_id) = $this->get_corridor_group_and_id($filled_array);

        //board is legal if there is a corridor group with a zero or positive id, -1 otherwise.
        return $corridor_group_id >= 0;
    }

    function get_illegal_spaces($filled_array)
    {
        $illegal_spaces = [];
        list($groups,$corridor_group_id) = $this->get_corridor_group_and_id($filled_array);

        foreach ($groups[$corridor_group_id] as $space_id)
        {
            if (!($this->is_legal_gameboard(array_merge($filled_array,array($space_id)))))
            {
                $illegal_spaces[] = $space_id;
            }
        }

        return $illegal_spaces;
    }

    function score_game($illegal_spaces,$board)
    {
        
        //list($groups,$corridor_group_id) = $this->get_corridor_group_and_id($filled_array);

        //Iterate through the empty corridor spaces adjacency
        //adding adjacent spaces to the player_id keyed array
        $score_spaces = [];
        
        $player_ids =  array_keys($this->loadPlayersBasicInfos()); 

        foreach($player_ids as $player_id)
        {
            $score_spaces[$player_id] = [];
        }
        
        //for each space in the corridor, add the adjacent space's owners to the 
        //appropriate $score_spaces list
        foreach($illegal_spaces as $space_id)
        {
            foreach($this->adjacency_graph[$space_id] as $adjacency_id)
            {
                $owner = $board[$adjacency_id]['owner'];
                if( $owner != null) // skip other adjacent corridor spaces
                {
                    $score_spaces[$owner][] = $adjacency_id;
                }
            }
        }

        //$score_spaces array should now contain two arrays with space_ids of spaces next to the corridor.
        //However there will be many duplicates from the adjacency matrix. These need to be culled.

        foreach(array_keys($score_spaces) as $owner)
        {   
            $score_spaces[$owner] =array_unique($score_spaces[$owner]);
        }

        return $score_spaces;
    }

    function get_corridor_group_and_id($filled_array)
    {
        $groups = $this->do_groups($filled_array);

        //return both the corridor group and its group id.
        return array($groups,$this->get_corridor_group($groups));
    }

    function get_filled_array(& $board)
    {
        $filled_array = [];

        foreach ($board as $space)
        {
            if ($space['owner'] != null)
            {
                $filled_array[] = $space['space_id'];
            }
        }

        return $filled_array;
    }
}
