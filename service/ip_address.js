const requestIp = require('request-ip');
const ipaddr = require('ipaddr.js');

const getIPaddr = function(request) {
	return requestIp.getClientIp(request);
};

const getIPv4 = function(ip) {
	if (ipaddr.IPv4.isValid(ip)) {
  	return ip;
	} else if (ipaddr.IPv6.isValid(ip)) {
	  ip = ipaddr.IPv6.parse(ip);
	  if (ip.isIPv4MappedAddress()) {
	    return ip.toIPv4Address().toString();
	  } else {
	  	return ip;
	  }
	} else {
	  throw new Error('IP地址错误');
	}
};

module.exports = {
	getIPaddr: getIPaddr,
	getIPv4: getIPv4,
};