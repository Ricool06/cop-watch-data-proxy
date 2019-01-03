const config = {
  app: {
    gatewayHost: process.env.GATEWAY_HOST || 'cop-watch-api-gateway',
    publishSocketPort: Number(process.env.PUBLISH_SOCKET_PORT) || 9090,
    subscribeSocketPort: Number(process.env.SUBSCRIBE_SOCKET_PORT) || 9091,
  },
};

module.exports = config;
