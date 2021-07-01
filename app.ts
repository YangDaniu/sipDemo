import { SimpleUser, SimpleUserOptions } from "sip.js/lib/platform/web";

// Helper function to get an HTML audio element
function getAudioElement(id: string): HTMLAudioElement {
  const el = document.getElementById(id);
  console.log(el)
  if (!(el instanceof HTMLAudioElement)) {
    throw new Error(`Element "${id}" not found or not an audio element.`);
  }
  return el;
}

// Helper function to wait
async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Main function
async function main(): Promise<void> {

  // SIP over WebSocket Server URL
  // The URL of a SIP over WebSocket server which will complete the call.
  // FreeSwitch is an example of a server which supports SIP over WebSocket.
  // SIP over WebSocket is an internet standard the details of which are
  // outside the scope of this documentation, but there are many resources
  // available. See: https://tools.ietf.org/html/rfc7118 for the specification.
  const server = "ws://10.48.127.22:5066";

  // SIP Request URI
  // The SIP Request URI of the destination. It's "Who you wanna call?"
  // SIP is an internet standard the details of which are outside the
  // scope of this documentation, but there are many resources available.
  // See: https://tools.ietf.org/html/rfc3261 for the specification.
  const destination = "sip:5001@127.0.0.1";

  // SIP Address of Record (AOR)
  // This is the user's SIP address. It's "Where people can reach you."
  // SIP is an internet standard the details of which are outside the
  // scope of this documentation, but there are many resources available.
  // See: https://tools.ietf.org/html/rfc3261 for the specification.
  const aor = "sip:1000@127.0.0.1";

  // SIP Authorization Username
  // This is the user's authorization username used for authorizing requests.
  // SIP is an internet standard the details of which are outside the
  // scope of this documentation, but there are many resources available.
  // See: https://tools.ietf.org/html/rfc3261 for the specification.
  const authorizationUsername = '1001';

  // SIP Authorization Password
  // This is the user's authorization password used for authorizing requests.
  // SIP is an internet standard the details of which are outside the
  // scope of this documentation, but there are many resources available.
  // See: https://tools.ietf.org/html/rfc3261 for the specification.
  const authorizationPassword = '1234';

  // Configuration Options
  // These are configuration options for the `SimpleUser` instance.
  // Here we are setting the HTML audio element we want to use to
  // play the audio received from the remote end of the call.
  // An audio element is needed to play the audio received from the
  // remote end of the call. Once the call is established, a `MediaStream`
  // is attached to the provided audio element's `src` attribute.
  const options: SimpleUserOptions = {
    aor,
    media: {
      remote: {
        audio: getAudioElement("remoteAudio")
      }
    },
    userAgentOptions: {
      authorizationPassword,
      authorizationUsername,
    }
  };

  // Construct a SimpleUser instance
  const simpleUser = new SimpleUser(server, options);

  // Supply delegate to handle inbound calls (optional)
  simpleUser.delegate = {
    onCallReceived: async () => {
      console.log(`!!!!`)
      await simpleUser.answer();
    }
  };

  // Connect to server
  await simpleUser.connect();

  // Register to receive inbound calls (optional)
  await simpleUser.register();

  // Place call to the destination
  await simpleUser.call(destination);

  // Wait some number of milliseconds
  // await wait(15000);

  window.send1 = function(){
    simpleUser.sendDTMF('1')
  }

  window.hangup = function(){
    simpleUser.hangup()
  }
}

setTimeout(() => {
  // Run it
main()
.then(() => console.log(`Success`))
.catch((error: Error) => console.error(`Failure`, error));
}, 1000);
