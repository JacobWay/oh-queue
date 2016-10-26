class TicketButtons extends React.Component {
  constructor(props) {
    super(props);
    this.assign = this.assign.bind(this);
    this.delete = this.delete.bind(this);
    this.resolveAndNext = this.resolveAndNext.bind(this);
    this.resolve = this.resolve.bind(this);
    this.unassign = this.unassign.bind(this);
    this.reassign = this.reassign.bind(this);
    this.next = this.next.bind(this);
  }

  assign() {
    app.makeRequest('assign', this.props.ticket.id);
  }

  delete() {
    if (!confirm("Delete this ticket?")) return;
    app.makeRequest('delete', this.props.ticket.id);
  }

  resolveAndNext() {
    app.makeRequest('resolve', this.props.ticket.id, true)
  }

  resolve() {
    app.makeRequest('resolve', this.props.ticket.id);
  }

  unassign() {
    app.makeRequest('unassign', this.props.ticket.id);
  }

  reassign() {
    if (!confirm("Reassign this ticket?")) return;
    app.makeRequest('assign', this.props.ticket.id);
  }

  next() {
    app.makeRequest('next', this.props.ticket.id, true);
  }

  render() {
    let {state, ticket} = this.props;
    let helper = isHelper(state);

    function makeButton(text, style, action) {
      return (
        <button onClick={action}
          className={`btn btn-${style} btn-lg btn-block`}>
          {text}
        </button>
      );
    }

    let topButtons = [];
    let bottomButtons = [];

    if (ticket.status === 'pending') {
      bottomButtons.push(makeButton('Delete', 'danger', this.delete));
      if (helper) {
        topButtons.push(makeButton('Help', 'primary', this.assign));
      }
    }
    if (ticket.status === 'assigned') {
      bottomButtons.push(makeButton('Resolve', 'default', this.resolve));
      if (helper) {
        if (ticket.helper.id === state.currentUser.id) {
          topButtons.push(makeButton('Resolve and Next', 'primary', this.resolveAndNext));
          bottomButtons.push(makeButton('Requeue', 'default', this.unassign));
        } else {
          topButtons.push(makeButton('Reassign', 'warning', this.reassign));
          topButtons.push(makeButton('Next Ticket', 'default', this.next));
        }
      }
    }
    if (helper && (ticket.status === 'resolved' || ticket.status === 'deleted')) {
      topButtons.push(makeButton('Next Ticket', 'default', this.next));
    }

    let hr = topButtons.length && bottomButtons.length ? <hr/> : null;

    if (!(topButtons.length || bottomButtons.length)) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
          <div className="well">
            {topButtons}
            {hr}
            {bottomButtons}
          </div>
        </div>
      </div>
    );
  }
}