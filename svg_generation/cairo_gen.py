#Generate Cairo Tiling SVG with clickable pentagons
import math
import os

LONG_SIDE_LEN = 50
SHORT_SIDE_LEN = math.sqrt(3)*LONG_SIDE_LEN - LONG_SIDE_LEN
LONG_TRIANGLE_LEG = math.sin(60*math.pi/180)*LONG_SIDE_LEN
SHORT_TRIANGLE_LEG = math.sin(30*math.pi/180)*LONG_SIDE_LEN

NUM_COLS = 6
NUM_ROWS = 4

SVG_WIDTH = NUM_COLS * (LONG_TRIANGLE_LEG*2+SHORT_TRIANGLE_LEG) + SHORT_TRIANGLE_LEG
SVG_HEIGHT = NUM_ROWS * (2*(LONG_TRIANGLE_LEG+SHORT_TRIANGLE_LEG)) + SHORT_SIDE_LEN

header = ["<!DOCTYPE html>\n","<html>\n","<body>\n",f"<svg width=\"{SVG_WIDTH}\" height=\"{SVG_HEIGHT}\">\n"]
footer = ["</SVG>\n</BODY>\n</HTML>\n"]
__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
class poly_svg():
    def __init__(self, poly):
        self.poly = poly
        self.rotation = 0
        self.rotation_pt =[]
        self.x_delta = 0
        self.y_delta = 0
        self.id = ''
        self.points_str = ''.join( map(lambda pt: str(pt[0])+','+str(pt[1])+' ', poly))

    def set_x_and_y_delta(self,x_delta,y_delta):
        self.x_delta = x_delta
        self.y_delta = y_delta

    def setup_top_pentagram(self):
        self.rotation = '0'
        self.rotation_pt =[]
    
    def setup_right_pentagram(self):
        self.rotation = '-90'
        self.rotation_pt = [str(self.poly[2][0]),str(self.poly[2][1])] #right point of pentagon
    
    def setup_left_pentagram(self):
        self.rotation = '90'
        self.rotation_pt = [str(self.poly[4][0]),str(self.poly[4][1])] #left point of pentagon
    
    def setup_bottom_pentagram(self):
        self.rotation = '180'
        self.rotation_pt = [str(self.poly[3][0]),str(self.poly[3][1]+SHORT_SIDE_LEN/2)]

    def generate_svg_line(self):
        svg_line = "    <A HREF=\"javascript: click_on_pentagon('"+self.id+"')\">\n"

        svg_line += f"      <polygon class=\"pentagon\" style=\"fill:#FFFFFF;stroke:#000000;stroke-width:1\" "
        svg_line += f"id=\"{self.id}\" "
        svg_line += f"points=\"{self.points_str}\" "

        if self.rotation != '0':
            svg_line += f"transform=\"rotate({self.rotation+','+self.rotation_pt[0]+','+self.rotation_pt[1]})\""
        
        if self.x_delta != 0 or self.y_delta != 0:
            if self.rotation == '0':
                svg_line += f"transform= \" "

            svg_line = svg_line[:-1] + f" translate({str(self.x_delta)+','+str(self.y_delta)})\""

        svg_line += '/>\n'
        svg_line += '   </A>\n'
        return svg_line

def calc_initial_pentagon():
    #build points from top and around clockwise
    
    #if you think of the pentagram as being constructed from triangles along the sides of a rectangle, the hypoteneuses are all long sides of the pentagon, 
    # and the points positions can be found
    # by adding the sides of the triangles together in various combinations
    # This is an upside-down pentagon.

    

    top_left = [SHORT_TRIANGLE_LEG,0]
    top_right = [LONG_TRIANGLE_LEG*2-SHORT_TRIANGLE_LEG, 0]
    
    right = [LONG_TRIANGLE_LEG*2, LONG_TRIANGLE_LEG]
    bottom = [LONG_TRIANGLE_LEG, LONG_TRIANGLE_LEG+ SHORT_TRIANGLE_LEG]
    left = [0, LONG_TRIANGLE_LEG]
    
    poly = [top_left, top_right, right, bottom, left]

    #to make room for the pentagon to the left, we need to displace the intial pentagon over to the right a little
    poly = list(map(lambda pt: [pt[0]+SHORT_TRIANGLE_LEG,pt[1]], poly))

    return poly

def calc_x_y_delta():

    #calculates the delta between repetitions - this is multiplied to get "rows" and "columns"

    y_delta = (LONG_SIDE_LEN * math.sqrt(3)- LONG_SIDE_LEN+ 2* SHORT_TRIANGLE_LEG + 2*LONG_TRIANGLE_LEG)
    x_delta = LONG_TRIANGLE_LEG *2 

    return x_delta,y_delta

template_poly = poly_svg(calc_initial_pentagon())
x_delta, y_delta = calc_x_y_delta()
alternating_offset = y_delta/2 #used to make the columns start at a different location.

with open(os.path.join(__location__,"out.html"), "w") as svg:
    svg.writelines(header)

    #columns generated top to bottom, left to right
    for i in range(NUM_COLS):
        #start with offset to non-offset
        cur_offset = alternating_offset * ((i+1)%2)

        #this loop generates a 4 pentagon "block" (my word) each time through.
        
        for j in range(NUM_ROWS):

            #The cairo corridor game board has partial "blocks" at the top and bottom of each column.
            #Code is in here to not generate the appropriate pentagons for those blocks

            three_bottom = j==0 and cur_offset > 0
            three_top = j==3 and cur_offset == 0
            top_only = j==3 and cur_offset > 0
            bottom_only = j==0 and cur_offset == 0

            #if none of the above are true, generate all 4 pentagrams
            do_all = not (three_bottom or three_top or top_only or bottom_only)

            #due to the elimination of pentagons, the entire board is offset down a bit.
            #this is to offset that offset :P

            move_to_top = -(SHORT_SIDE_LEN + LONG_TRIANGLE_LEG + SHORT_TRIANGLE_LEG)


            #so these deltas to move the pentagons around are a bit weird.
            #once a pentagon is rotated, the entire coordinate *plane* is rotated, which means in some cases
            # the x-axis and y-axis are swapped or are in different directions.

            if do_all or top_only or three_top:
                #top 
                template_poly.set_x_and_y_delta(x_delta*i, y_delta*j+cur_offset+move_to_top)
                template_poly.setup_top_pentagram()
                template_poly.id = f'{i}_{j}_0'
                svg.write(template_poly.generate_svg_line())

            if do_all or three_bottom or three_top:
                #left
                template_poly.set_x_and_y_delta(y_delta*j+cur_offset+move_to_top, -x_delta*i)
                template_poly.setup_left_pentagram()
                template_poly.id = f'{i}_{j}_1'
                svg.write(template_poly.generate_svg_line())

                #right
                template_poly.set_x_and_y_delta(-(y_delta*j+cur_offset+move_to_top), x_delta*i)
                template_poly.setup_right_pentagram()
                template_poly.id = f'{i}_{j}_2'
                svg.write(template_poly.generate_svg_line())

            if do_all or bottom_only or three_bottom:
                #bottom
                template_poly.set_x_and_y_delta(-x_delta*i, -(y_delta*j+cur_offset+move_to_top))
                template_poly.setup_bottom_pentagram()
                template_poly.id = f'{i}_{j}_3'
                svg.write(template_poly.generate_svg_line())

    svg.writelines(footer)