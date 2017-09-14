class FSM {
	/**
	 * Creates new FSM instance.
	 * @param config
	 */
	constructor(config) {
		if (!config)
			new Error('config not found');
		this.currentState = config.initial;
		this.states = config.states;

		this.statesHistory = [this.currentState];
		this.redoPermission = true;
		this.currentStateNumber = 0;
	}

	/**
	 * Returns active state.
	 * @returns {String}
	 */
	getState() {
		return this.currentState;
	}

	/**
	 * Goes to specified state.
	 * @param state
	 */
	changeState(state) {
		if(this.states[state]) {
			this.currentStateNumber++;
			this.statesHistory.push(state);
			this.currentState = state;
		}
		else
			new Erorr(404);
		this.redoPermission = false;
		return this.currentState;
	}

	/**
	 * Changes state according to event transition rules.
	 * @param event
	 */
	trigger(event) {
		this.redoPermission = false;
		if(this.states[this.currentState].transitions[event]) {
			this.currentStateNumber++;
			if(this.statesHistory[this.currentStateNumber] !== this.states[this.currentState].transitions[event])
				this.statesHistory.push(this.states[this.currentState].transitions[event]);
			this.currentState = this.states[this.currentState].transitions[event];
		} else {
			throw new Error("can't change state");
		}
	}

	/**
	 * Resets FSM state to initial.
	 */
	reset() {
		this.currentStateNumber++;
		this.statesHistory.push(this.currentState);
		this.currentState  = this.statesHistory[0];
	}

	/**
	 * Returns an array of states for which there are specified event transition rules.
	 * Returns all states if argument is undefined.
	 * @param event
	 * @returns {Array}
	 */
	getStates(event = null) {
		let states = [];
		if(!event) {
			for(let key in this.states) {
				states.push(key);
			}
		} else {
			for(let key in this.states) {
				if(this.states[key].transitions[event])
					states.push(key);
			}
		}

		return states;
	}

	/**
	 * Goes back to previous state.
	 * Returns false if undo is not available.
	 * @returns {Boolean}
	 */
	undo() {
		this.redoPermission = true;  
		if(this.currentStateNumber !== 0) {
			this.currentState = this.statesHistory[--this.currentStateNumber];
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * Goes redo to state.
	 * Returns false if redo is not available.
	 * @returns {Boolean}
	 */
	redo() {
		if(this.redoPermission === false)
			return false;
		if(this.statesHistory[this.currentStateNumber + 1])  {
			this.currentState = this.statesHistory[++this.currentStateNumber];
			return true;
		}
		else return false;
	}

	/**
	 * Clears transition history
	 */
	clearHistory() {
		this.statesHistory = [];
		this.currentStateNumber = 0;
	}
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
