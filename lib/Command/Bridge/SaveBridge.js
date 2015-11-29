'use strict';

let Bridge = require('../../Model/Bridge');
let Error  = require('../../Error');
let Utils  = require('./Utils');

const ATTRIBUTE_MAP = {
  'name':          'name',
  'zigbeeChannel': 'zigbeechannel',
  'ipAddress':     'ipaddress',
  'dhcp':          'dhcp',
  'netmask':       'netmask',
  'gateway':       'gateway',
  'proxyPort':     'proxyport',
  'proxyAddress':  'proxyaddress',
  'timeZone':      'timezone',
  'linkButton':    'linkbutton',
  'touchLink':     'touchlink',
};

/**
 * Save bridge command
 *
 * Saves bridge
 */
class SaveBridge {
  /**
   * Constructor
   *
   * @param {Bridge} bridge Bridge
   */
  constructor(bridge) {
    Utils.validateBridge(bridge);

    this.bridge            = bridge;
    this.changedAttributes = bridge.attributes.getChanged();
  }

  /**
   * Invoke command
   *
   * @param {Client} client Client
   *
   * @return {Promise} Promise for chaining
   */
  invoke(client) {
    let promises = [];
    for (let key in this.changedAttributes) {
      if (key in ATTRIBUTE_MAP) {
        promises.push(
          this.saveBridgeAttribute(
            client,
            ATTRIBUTE_MAP[key],
            this.changedAttributes[key]
          )
        );
      }
    }

    return Promise.all(promises)
      .then(results => {
        this.bridge.attributes.resetChanged();

        return this.bridge;
      });
  }

  /**
   * Save bridge attribute
   *
   * @param {Client} client    Client
   * @param {string} attribute Attribute
   * @param {mixed}  value     Value
   *
   * @return {Promise} Promise for chaining
   */
  saveBridgeAttribute(client, attribute, value) {
    let options = {
      method: 'PUT',
      path:   `api/${client.username}/config`,
      body:   {}
    };

    options.body[attribute] = value;

    return client.getTransport()
      .sendRequest(options);
  }
}

module.exports = SaveBridge;