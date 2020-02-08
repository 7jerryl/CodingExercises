/**
 * FIELD PARAMETER DEFAULTS
 * @param {string} type
 * @param {string} pattern
 * @param {string} placeholder
 * @param {string} icon
 */
const getFieldParams = (
  type = 'text',
  pattern = '*',
  placeholder = '',
  icon = 'arrow-right'
) => ({
  type,
  pattern,
  placeholder,
  required: true,
  title: placeholder,
  format: `fas fa-${icon}`,
});

/**
 * FIELD PARAMETERS
 */
const fieldParams = {
  'First and Last Name': getFieldParams(
    null,
    '[A-Z][a-z]+ [A-Z][a-z]+',
    'Example: John Doe',
    'user'
  ),
  'NPI Number': getFieldParams(
    null,
    '\\d{10}',
    'Example: 0123456789',
    'id-card'
  ),
  'Business Address': getFieldParams(
    null,
    null,
    'Example: 0123 West Business Drive',
    'map-marker'
  ),
  'Telephone Number': getFieldParams(
    'tel',
    '\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}',
    'Example: (012) 345-6789',
    'phone'
  ),
  'Email Address': getFieldParams(
    'email',
    "^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
    'Example: JohnDoe@domain.com',
    'envelope'
  ),
};

/**
 * STATE INFORMATION
 */
const fieldNames = Object.keys(fieldParams);
const initialState = fieldNames.reduce(
  (state, field) => {
    Object.assign(state.fields, {
      [field]: { value: '', state: 0 },
    });
    return state;
  },
  { submission: null, fields: {} }
);
const STATE_COLORS = Object.freeze(['', ' is-danger', ' is-success']);

/**
 * PHONE FORMAT HELPER
 * @param {object} event
 */
const formatPhoneNumber = event => {
  const result = event.target.value.match(/\d/g) || [];
  const areaCode = `${result.slice(0, 3).join('')}`;
  const prefix = `${result.slice(3, 6).join('')}`;
  const lineNumber = `${result.slice(6, 10).join('')}`;
  const formattedAreaCode = prefix.length > 0 ? `(${areaCode})` : areaCode;
  const formattedPrefix = prefix.length > 0 ? ` ${prefix}` : prefix;
  const formattedLineNumber =
    lineNumber.length > 0 ? `-${lineNumber}` : lineNumber;
  return `${formattedAreaCode}${formattedPrefix}${formattedLineNumber}`;
};

/**
 * FORMAT HELPER OBJECT
 */
const formatters = {
  'NPI Number': event => event.target.value.replace(/\D/g, '').slice(0, 10),
  'Telephone Number': formatPhoneNumber,
};

/**
 * SET INFO IN MIDDLE OF PAGE
 */
const setInfo = info => {
  const entries = Object.entries(info);
  return (
    <div className="columns">
      <div className="column is-4 has-background-white-ter"></div>
      <div className="column is-4 has-background-white-ter">
        <section className="hero is-fullheight">
          <div className="hero-body">
            <div className="container">
              <div className="box has-background-warning">
                Submitted: <pre>{JSON.stringify(info, null, 4)}</pre>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="column is-4 has-background-white-ter"></div>
    </div>
  );
};

/**
 * MAIN CLASS
 */
class RegistrationInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.textBox = this.textBox.bind(this);
  }

  handleChange(fieldName) {
    return event => {
      const newValue = formatters[fieldName] || (() => event.target.value);
      const regexValid =
        !fieldParams[fieldName].pattern ||
        RegExp(fieldParams[fieldName].pattern).test(event.target.value);

      const value = newValue(event);
      const state = value.length > 0 ? (regexValid ? 2 : 1) : 0;

      Object.assign(this.state.fields, {
        [fieldName]: { value, state },
      });
      this.setState(this.state);
    };
  }

  handleSubmit(event) {
    const entries = Object.entries(this.state.fields);
    const submission = entries.reduce(
      (map, [key, { value }]) => Object.assign(map, { [key]: value }),
      {}
    );

    this.setState({ submission });
    event.preventDefault();
  }

  textBox(fieldName) {
    const stateColor = STATE_COLORS[this.state.fields[fieldName].state];
    const textColor = stateColor.replace('is', 'has-text');
    const checkState =
      this.state.fields[fieldName].state === 2 ? '' : ' is-hidden';
    const timesState =
      this.state.fields[fieldName].state === 1 ? '' : ' is-hidden';
    return (
      <div className="field" key={fieldName}>
        <p className="control has-icons-left has-icons-right">
          <input
            className={`input${stateColor}`}
            type={fieldParams[fieldName].type}
            placeholder={fieldName}
            pattern={fieldParams[fieldName].pattern}
            required={fieldParams[fieldName].required}
            title={fieldParams[fieldName].title}
            onChange={this.handleChange(fieldName)}
            value={this.state.fields[fieldName].value}
          />
          <span className="icon is-small is-left">
            <i className={fieldParams[fieldName].format}></i>
          </span>
          <span className={`icon is-small is-right${textColor}`}>
            <span className={checkState}>
              <i className="fas fa-check"></i>
            </span>
            <span className={timesState}>
              <i className="fas fa-times"></i>
            </span>
          </span>
        </p>
      </div>
    );
  }

  render() {
    const fields = Object.keys(this.state.fields);
    return !this.state.submission ? (
      <div className="columns">
        <div className="column is-4 has-background-white-ter"></div>
        <div className="column is-4 has-background-white-ter">
          <section className="hero is-fullheight">
            <div className="hero-body">
              <div className="container">
                <div className="box has-background-warning">
                  <form onSubmit={this.handleSubmit}>
                    {fields.map(this.textBox)}
                    <div className="buttons has-addons is-centered">
                      <button className="button has-background-white-ter">
                        Register
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="column is-4 has-background-white-ter"></div>
      </div>
    ) : (
      setInfo(this.state.submission)
    );
  }
}

ReactDOM.render(<RegistrationInterface />, document.getElementById('root'));
