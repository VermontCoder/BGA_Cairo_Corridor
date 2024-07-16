
<head>
  <link rel="stylesheet" href="cairocorridor.css">
</head>
<BODY>
<SCRIPT>

selected_spaces = [];
groups = [];

function fill_space(space_id, color)
{
    document.getElementById(space_id).setAttributeNS(null,'style','fill:#' + color +';');
}

function highlight_space(space_id)
{
  fill_space(space_id,'FFBF00');
}

function select_space(space_id)
{
  fill_space(space_id,'888888');
  selected_spaces.push(space_id);
}

function deselect_space(space_id)
{
  fill_space(space_id,'FFFFFF');
  selected_spaces = selected_spaces.filter((element) => element !== space_id);
}

function click_on_pentagon(space_id)
{
  current_style = document.getElementById(space_id).getAttributeNS(null,'style');
  if (current_style.indexOf('#888888') <0)
  {
    select_space(space_id);
  }
  else
  {
    deselect_space(space_id);
  }
  
  document.getElementById('filled_ids').value = selected_spaces.toString();
}


</SCRIPT>

<?php
    require 'graph_variables.php';
    
    $groups = [];
    $adjacency_graph = [];
    

///// FUNCTIONS
    function output_svg() 
    {
      $lines = file('./svg.txt');
      foreach ($lines as $line) 
      {
          echo "$line";
      }
    };

    function output_selection_javascript($ids)
    {
      if (count($ids) > 0)
      {
        echo "<SCRIPT>";
        foreach ($ids as $id)
        {
          echo "select_space('$id');";
        }
        echo "</SCRIPT>";
      }
    }

    function output_corridor_group_javascript($group_num)
    {
      global $groups;

      echo "<SCRIPT>";
      foreach ($groups[$group_num] as $id)
      {
        echo "highlight_space('$id');";
      }
      echo "</SCRIPT>";
    }

    function add_space_to_group($cur_space, $cur_group)
    {
      global $groups, $adjacency_graph;
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
          add_space_to_group($adjacency, $cur_group);
        }
      }
    }

    function do_groups($filled_array)
    {
      global $groups, $adjacency_graph, $adjacency_graph_template;

       //calculate groups
      
      //initialize working arrays
      $adjacency_graph = $adjacency_graph_template;
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
        add_space_to_group($cur_space, $cur_group);
        
        $cur_group += 1;

        $groups[] = [];
      }

      //remove trailing empty group
      unset($groups[$cur_group]);
    }

    function check_end_game($corridor_ids, $filled_array)
    {
      //check that there are no more legal moves in the corridor - if that is the case, game is over.
      foreach ($corridor_ids as $id)
      {
        do_groups(array_merge($filled_array,array($id)));
        if (get_corridor_group() > -1)
        {
          //this move is legal, so there is still more of the game
          return false;
        }
      }
      return true;
    }

    function get_corridor_group()
    {
      //returns index of corridor group or -1 if there is none.
      //assumes $groups variable has already been calculated.

      //corridor group will have a space or spaces on all four sides of the playing field.
      global $groups;

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

        //no corridor group
        return -1;

      }

    }

//EXECUTING CODE
output_svg();
?>

<form method="post">
 <input type="text" id="filled_ids" name="filled_ids">
 <button>Save</button>
</form>
</BODY>

<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") 
    {

      $filled_array = explode(',',$_POST['filled_ids']);
      if ($filled_array[0] != '')
      {
        output_selection_javascript($filled_array);
      }

      do_groups($filled_array);

      $corridor_group_id = get_corridor_group();
      if ($corridor_group_id < 0)
      {
        //Move is illegal
        echo "Illegal Move<BR>";
        return;
      }
      output_corridor_group_javascript($corridor_group_id);
      echo check_end_game($groups[$corridor_group_id], $filled_array) ? 'end<br>' : 'game continues<BR>';
    }
    
?>
