/**
 * FIELD PARAMETER DEFAULTS
 * @param {String} type
 * @param {String} pattern
 * @param {String} placeholder
 * @param {String} icon
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
    null,
    'envelope'
  ),
};

/**
 * STATE INFORMATION
 */
const fieldNames = Object.keys(fieldParams);
const initialState = fieldNames.reduce(
  (fields, field) =>
    Object.assign(fields, { [field]: { value: '', state: 0 } }),
  {}
);
const STATE_COLORS = Object.freeze(['', ' is-danger', ' is-success']);

/**
 * PHONE FORMAT HELPER
 * @param {Object} event
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

      this.setState({
        [fieldName]: { value, state },
      });
    };
  }

  handleSubmit(event) {
    const entries = Object.entries(this.state);
    const submission = entries.reduce(
      (map, [key, { value }]) => Object.assign(map, { [key]: value }),
      {}
    );
    alert('Submitted information: ' + JSON.stringify(submission, null, 4));
    event.preventDefault();
  }

  textBox(fieldName) {
    const stateColor = STATE_COLORS[this.state[fieldName].state];
    const textColor = stateColor.replace('is', 'has-text');
    const checkState = this.state[fieldName].state === 2 ? '' : ' is-hidden';
    const timesState = this.state[fieldName].state === 1 ? '' : ' is-hidden';
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
            value={this.state[fieldName].value}
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
    const fields = Object.keys(this.state);
    return (
      <div class="columns">
        <div class="column is-4 has-background-white-ter"></div>
        <div class="column is-4 has-background-white-ter">
          <section class="hero is-fullheight">
            <div class="hero-body">
              <div class="container">
                <div class="box has-background-warning">
                  <form onSubmit={this.handleSubmit}>
                    {fields.map(this.textBox)}
                    <input type="submit" value="Submit" />
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="column is-4 has-background-white-ter"></div>
      </div>
    );
  }
}

ReactDOM.render(<RegistrationInterface />, document.getElementById('root'));
