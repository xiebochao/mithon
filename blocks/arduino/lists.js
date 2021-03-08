'use strict';

goog.provide('Blockly.Blocks.lists');

goog.require('Blockly.Blocks');


Blockly.Blocks.lists.HUE = 260;

Blockly.Blocks['lists_create_with'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
   init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput("")
    .appendField(new Blockly.FieldDropdown(DATATYPES), "TYPE")
    .appendField(' ')
    .appendField(new Blockly.FieldTextInput('mylist'), 'VAR')
    .appendField('[')
    .appendField(new Blockly.FieldTextInput('3',Blockly.FieldTextInput.math_number_validator), 'SIZE')
    .appendField(']');
    this.itemCount_ = 3;
    this.updateShape_();
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
  },
  /**
   * Create XML to represent list inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
   mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
   domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
   decompose: function(workspace) {
    var containerBlock =
    Blockly.Block.obtain(workspace, 'lists_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'lists_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
   compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
      itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
   saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
      itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
   updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
      .appendField(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE);
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField(Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH);
        }
      }
    }
  }
};

Blockly.Blocks['lists_create_with_text'] = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput("")
    .appendField(new Blockly.FieldDropdown(DATATYPES), "TYPE")
    .appendField(' ')
    .appendField(new Blockly.FieldTextInput('mylist'), 'VAR')
    .appendField('[')
    .appendField(new Blockly.FieldTextInput('3',Blockly.FieldTextInput.math_number_validator), 'SIZE')
    .appendField(']')
    .appendField(Blockly.MIXLY_MAKELISTFROM)
    .appendField(this.newQuote_(true))
    .appendField(new Blockly.FieldTextInput('0,0,0'), 'TEXT')
    .appendField(this.newQuote_(false))
    .appendField(Blockly.MIXLY_SPLITBYDOU);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.MIXLY_TOOLTIP_LISTS_CREATE_WITH_TEXT);
  },
  newQuote_: function(open) {
    if (open == this.RTL) {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAqUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhggONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvBO3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5AoslLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==';
    } else {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAn0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMfz9AylsaRRgGzvZAAAAAElFTkSuQmCC';
    }
    return new Blockly.FieldImage(file, 12, 12, '"');
  }
}

Blockly.Blocks['lists_create_with2'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
   init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput("")
    .appendField(new Blockly.FieldDropdown(DATATYPES), "TYPE")
    .appendField(' ')
    .appendField(new Blockly.FieldTextInput('mylist'), 'VAR')
    .appendField('[')
        //.appendField(new Blockly.FieldTextInput('3',Blockly.FieldTextInput.math_number_validator), 'SIZE')
        .appendField(']');
        this.itemCount_ = 3;
        this.updateShape_();
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
        this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
      },
  /**
   * Create XML to represent list inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
   mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
   domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
   decompose: function(workspace) {
    var containerBlock =
    Blockly.Block.obtain(workspace, 'lists_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'lists_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
   compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
      itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
   saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
      itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
   updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
      .appendField(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE);
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField(Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH);
        }
      }
    }
  }
};

Blockly.Blocks['lists_create_with_text2'] = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput("")
    .appendField(new Blockly.FieldDropdown(DATATYPES), "TYPE")
    .appendField(' ')
    .appendField(new Blockly.FieldTextInput('mylist'), 'VAR')
    .appendField('[')
    .appendField(new Blockly.FieldTextInput("3"), "SIZE")
    .appendField(']')
    .appendField(Blockly.MIXLY_MAKELISTFROM)
    .appendField(this.newQuote_(true))
    .appendField(new Blockly.FieldTextInput('0,0,0'), 'TEXT')
    .appendField(this.newQuote_(false))
    .appendField(Blockly.MIXLY_SPLITBYDOU);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.MIXLY_TOOLTIP_LISTS_CREATE_WITH_TEXT);
  },
  newQuote_: function(open) {
    if (open == this.RTL) {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAqUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhggONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvBO3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5AoslLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==';
    } else {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAn0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMfz9AylsaRRgGzvZAAAAAElFTkSuQmCC';
    }
    return new Blockly.FieldImage(file, 12, 12, '"');
  }
}

Blockly.Blocks['lists_create_with_container'] = {
  /**
   * Mutator block for list container.
   * @this Blockly.Block
   */
   init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput()
    .appendField(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['lists_create_with_item'] = {
  /**
   * Mutator bolck for adding items.
   * @this Blockly.Block
   */
   init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput()
    .appendField(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks.lists_getIndex = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.setOutput(true, Number);
    this.appendValueInput('AT')
    .setCheck(Number)
    .appendField(new Blockly.FieldTextInput('mylist'), 'VAR')
    .appendField(Blockly.LANG_LISTS_GET_INDEX1);
    this.appendDummyInput("")
    .appendField(Blockly.LANG_LISTS_GET_INDEX2);
    this.setInputsInline(true);
    this.setTooltip(Blockly.LANG_LISTS_GET_INDEX_TOOLTIP);
  }
};

Blockly.Blocks.lists_setIndex = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('AT')
    .setCheck(Number)
    .appendField(new Blockly.FieldTextInput('mylist'), 'VAR')
    .appendField(Blockly.LANG_LISTS_SET_INDEX1);
    this.appendValueInput('TO')
    .appendField(Blockly.LANG_LISTS_SET_INDEX2);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_LISTS_SET_INDEX_TOOLTIP);
  }
};

Blockly.Blocks['lists_length'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
   init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput("")
    .appendField(Blockly.MIXLY_LENGTH)
    .appendField(new Blockly.FieldTextInput('mylist'), 'VAR');
    this.setTooltip(Blockly.Msg.LISTS_LENGTH_TOOLTIP);
    this.setOutput(true, Number);
  }
};

//创建二维数组
Blockly.Blocks['create_array2_with_text'] = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput("name")
    .setCheck(null)
    .appendField(new Blockly.FieldDropdown(DATATYPES), "TYPE")
    .appendField(Blockly.MIXLY_ARRAY2);
    this.appendValueInput("line")
    .setCheck(null)
    .appendField(Blockly.array2_rows);
    this.appendValueInput("list")
    .setCheck(null)
    .appendField(Blockly.array2_cols);
    this.appendValueInput("String")
    .setCheck(null)
    .appendField(Blockly.MIXLY_MAKELISTFROM );
    this.appendDummyInput()
    .appendField(Blockly.MIXLY_ESP32_SET);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("");
  }
};


//二维数组赋值
Blockly.Blocks['array2_assignment'] = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput("name")
    .setCheck(null)
    .appendField(Blockly.array2_assignment);
    this.appendValueInput("line")
    .appendField(Blockly.Msg.DATAFRAME_RAW)
    this.appendValueInput("list")
    .appendField(Blockly.Msg.DATAFRAME_COLUMN);
    this.appendValueInput("assignment").appendField(Blockly.MIXLY_VALUE2);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setHelpUrl("");
  }
};

//获取二维数组值
Blockly.Blocks['get_array2_value'] = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput("name")
    .setCheck(null)
    .appendField(Blockly.get_array2_value);
    this.appendValueInput("line")
    .appendField(Blockly.Msg.DATAFRAME_RAW);
    this.appendValueInput("list")
    .appendField(Blockly.Msg.DATAFRAME_COLUMN);
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setHelpUrl("");
  }
};
Blockly.Blocks.lists_array2_setup= {
  init: function() { 
    this.appendDummyInput()  
    .appendField(Blockly.MIXLY_SETUP+Blockly.MIXLY_ARRAY2);
    this.appendDummyInput()  
    .appendField(new Blockly.FieldDropdown(DATATYPES), "lists_create_type")
    .appendField(new Blockly.FieldTextInput("mylist"), "lists_create_name")
    .appendField("[ ][ ]");
    this.appendStatementInput("lists_with_2_1_data")
    .setCheck(null)  
    .appendField(Blockly.Msg.VARIABLES_SET_TITLE);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Blocks.lists.HUE);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
Blockly.Blocks.lists_array2_setup_get_data = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
   init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput("");
    this.itemCount_ = 3;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
    this.setTooltip("");
  },
  /**
   * Create XML to represent list inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
   mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
   domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
   decompose: function(workspace) {
    var containerBlock =
    Blockly.Block.obtain(workspace, 'lists_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'lists_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
   compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
      itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
   saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
      itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
   updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("");
    } else {
      for (var i = 0; i <= this.itemCount_; i++) {

        if (i > 0 && i< this.itemCount_) {
          var input = this.appendValueInput('ADD' + i);
          input.setAlign(Blockly.ALIGN_RIGHT)
          input.appendField(",");
        }
        if(i == 0)
        {
          var input = this.appendValueInput('ADD' + i);
          input.setAlign(Blockly.ALIGN_RIGHT);
          input.appendField("{");
        }
        else if(i == this.itemCount_)
        {
          var input = this.appendDummyInput('ADD' + i);
          input.setAlign(Blockly.ALIGN_RIGHT);
          input.appendField("}");
        }
      }
    }
  }
};

//一维数组循环
Blockly.Blocks.loop_array= {
  init: function() {
    this.appendValueInput("name")
    .setCheck(null)
    .appendField(Blockly.MIXLY_MICROBIT_PY_CONTORL_GET_TYPE).appendField(new Blockly.FieldDropdown(DATATYPES), "TYPE")
    .appendField(Blockly.MIXLY_LIST_NAME);
    this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown([[Blockly.Msg.LEFT_CYCLE,"0"], [Blockly.Msg.RIGHT_CYCLE,"1"]]), "mode");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Blocks.lists.HUE);
    this.setTooltip(Blockly.Msg.LEFT_CYCLE+Blockly.Msg.LEFT_CYCLE1+Blockly.Msg.RIGHT_CYCLE+Blockly.Msg.RIGHT_CYCLE1);
    this.setHelpUrl("");
  }
};

//获取二维数组的行数与列数
Blockly.Blocks.lists_array2_get_length= {
  init: function() { 
  this.appendDummyInput()  
  .appendField(Blockly.MIXLY_ARRAY2)
  .appendField(new Blockly.FieldTextInput("mylist"), "list_name")
  .appendField(" "+Blockly.MIXLY_GET)
  .appendField(new Blockly.FieldDropdown([[Blockly.array2_rows,"row"],[Blockly.array2_cols,"col"]]), "type");
  this.setInputsInline(true);
  this.setOutput(true, null);
  this.setColour(Blockly.Blocks.lists.HUE);
  this.setTooltip("");
  this.setHelpUrl("");
  }
};