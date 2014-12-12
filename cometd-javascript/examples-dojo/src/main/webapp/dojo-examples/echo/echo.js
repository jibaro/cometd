require(["dojo", "dojo/on", "dojo/keys", "dojo/_base/unload", "dojox/cometd", "dojox/cometd/timestamp", "dojo/domReady!"],
function(dojo, on, keys, unload, cometd)
{
    function echoRpc(text)
    {
        console.debug("Echoing", text);

        setTimeout(function ()
        {
            cometd.remoteCall("echo", {msg: text}, function(reply)
            {
                dojo.byId("responses").innerHTML +=
                    (reply.timestamp || "") + " " + reply.channel + ": " + reply.data.msg + "<br/>";
            });
        }, 0);
    }

    unload.addOnUnload(cometd, "disconnect");

    var phrase = dojo.byId("phrase");
    phrase.setAttribute("autocomplete", "OFF");
    on(phrase, "keyup", function(e)
    {
        if (e.keyCode == keys.ENTER)
        {
            echoRpc(phrase.value);
            phrase.value = "";
            return false;
        }
        return true;
    });
    var sendB = dojo.byId("sendB");
    on(sendB, "click", function(e)
    {
        echoRpc(phrase.value);
        phrase.value = "";
        return false;
    });

    cometd.configure({
        url: location.href.replace(/\/dojo-examples\/.*$/, "") + "/cometd",
        logLevel: "debug"
    });
    cometd.handshake();
});