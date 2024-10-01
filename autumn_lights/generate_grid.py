from copy import deepcopy
from dataclasses import dataclass
from typing import Optional, List, Tuple
from pprint import pprint

# values indicate order of wiring path. 0 is the starting point at 0,1. 
# 1 is at 0,0. 2 is at 1,0. 3 is at 1,1. 4 is at 2,1. 5 is at 2,0.
# Remember that the origin of the grid is at the top left corner in the
# left to right orientation.  It is the top right corner in the right to
# left orientation.
def grid_template():
    template = [
        [1,  2,  5,  6,  9, 10],
        [0,  3,  4,  7,  8, 11],
        [22, 21, 18, 17, 14, 12],
        [23, 20, 19, 16, 15, 13],
        [25, 26, 29, 30, 33, 34],
        [24, 27, 28, 31, 32, 35],
    ]
    return deepcopy(template)

# the physical size of a grid cell in inches
GRID_CELL_SIZE = 5
SQUARE_SIZE = 36
LEFT_TO_RIGHT = 0
RIGHT_TO_LEFT = 1

def flip_grid_on_y(grid):
    return [list(reversed(row)) for row in grid]

def increment_grid_piece(grid_piece, size):
    for y in range(len(grid_piece)):
        for x in range(len(grid_piece[y])):
            grid_piece[y][x] += size

def concatenate_grid_piece(meta_row, grid_piece):
    for meta_subrow, add_subrow in zip(meta_row, grid_piece):
        meta_subrow.extend(add_subrow)

def append_meta_row(metagrid, meta_row):
    for row in meta_row:
        metagrid.append(row)

def create_metagrid(width: int, height: int):
    # where width is the number of grid templates in a row, and height is the 
    # number of grid templates high.
    meta_grid = []
    orientation = -1
    increment_size = 0
    for y in range(height):
        print(f"y: {y}")
        # create an empty metarow for each grid  in this row to append to.
        meta_row = [[] for line in grid_template()]
        #import ipdb; ipdb.set_trace()
        if orientation == LEFT_TO_RIGHT:
            orientation = RIGHT_TO_LEFT
        else:
            orientation = LEFT_TO_RIGHT
        for x in range(width):
            grid_piece = grid_template()
            
            increment_grid_piece(grid_piece, increment_size)
            concatenate_grid_piece(meta_row, grid_piece)
            increment_size += SQUARE_SIZE
        if orientation == RIGHT_TO_LEFT:
                meta_row = flip_grid_on_y(meta_row)
        append_meta_row(meta_grid, meta_row)
    return meta_grid



def three_by_two():
    pprint(create_metagrid(3, 2), width=200)


def generate_physical_layout(width: int, height: int):
    """Generate the physical layout of LEDs in order of the wiring.  Copy/paste 
    this output into the pixel blaze mapper page"""
    # Get the metagrid representing the wiring order
    metagrid = create_metagrid(width, height)
    
    # Create a dictionary to store the (LED index, (x, y)) positions
    physical_layout = {}
    
    # Iterate over the metagrid to calculate the physical positions
    for y, row in enumerate(metagrid):
        for x, led_index in enumerate(row):
            # Calculate real-world coordinates (x, y)
            real_x = x * GRID_CELL_SIZE
            real_y = y * GRID_CELL_SIZE
            physical_layout[led_index] = [real_x, real_y]
    
    # Sort by LED index to get the correct wiring order and return only the (x, y) coordinates
    ordered_physical_layout = [coords for _, coords in sorted(physical_layout.items())]
    
    return ordered_physical_layout
