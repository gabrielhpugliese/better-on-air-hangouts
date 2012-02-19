var HANGOUT_IMAGE_CLASS = "gt";

BetterOnAirHangouts = function() {};

BetterOnAirHangouts.prototype.init = function() {
    var content_pane = document.querySelector("#contentPane");
    if (content_pane) {
        content_pane.addEventListener('DOMNodeInserted', this.onGooglePlusContentModified.bind(this), false);
        setTimeout(this.renderAllItems.bind(this), 100);
    }
};

BetterOnAirHangouts.prototype.onGooglePlusContentModified = function(e) {
    if (e.relatedNode && e.relatedNode.parentNode && e.relatedNode.parentNode.id == 'contentPane') {
        this.renderAllItems(e.target);
    }
    else if (e.target.nodeType == Node.ELEMENT_NODE && e.target.id.indexOf('update') == 0) {
        this.renderItem(e.target);
    }
};

BetterOnAirHangouts.prototype.onExpandButtonClick = function(e) {
    var iframe = $("iframe", this.findPost(e.target));
    width = iframe.width();
    height = iframe.height();
    iframe.width(iframe.parent().parent().width());
    iframe.height(iframe.width() * (height / width));
};

BetterOnAirHangouts.prototype.onPlayAgainClick = function(e) {
    var post = this.findPost(e.target)
    var iframe = $("iframe", post);

    $("img." + HANGOUT_IMAGE_CLASS, post).hide();
    $("div.s-r-Yf", post).hide();

    $(iframe).attr("src", $(".boah_helper", post).attr("iframe-url"));
    $(iframe).show();

};

BetterOnAirHangouts.prototype.onNewTabButtonClick = function(e) {
    var post = this.findPost(e.target)
    var iframe = $("iframe", post);

    var iframe_url = this.getIframeUrl(e.target);
    window.open(iframe_url);

    $(iframe).hide();
    $(iframe).attr("src", "");

    $("img." + HANGOUT_IMAGE_CLASS, post).show();
    $("div.s-r-Yf", post).show();

    play_img = $("img." + HANGOUT_IMAGE_CLASS, post).get(0);
    play_img.addEventListener('click', this.onPlayAgainClick.bind(this), false);

    play_img2 = $("div.s-r-Yf", post).get(0);
    play_img2.addEventListener('click', this.onPlayAgainClick.bind(this), false);
};

BetterOnAirHangouts.prototype.showShinyBox = function(title, content, target) {
    $(this).qtip({
        id: 'boah_modal',
        content: {
            text: content,
            title: {
                text: title,
                button: true
            }
        },
        position: {
            my: 'top left',
            at: 'bottom left',
            target: target,
            adjust: { x: 0, y: 5 }
        },
        show: {
            event: false,
            solo: true,
            modal: false
        },
        hide: false,
        style: 'ui-tooltip-blue ui-tooltip-rounded'
    });

    $(this).qtip('show');
};

BetterOnAirHangouts.prototype.getIframeUrl = function(button) {
    var iframe_url = $(".boah_helper", this.findPost(button)).attr("iframe-url");
    if (iframe_url.substr(0, 1) != 'h') {
        iframe_url = "http:" + iframe_url;
    }

    return iframe_url;
};

BetterOnAirHangouts.prototype.onEmbedButtonClick = function(e) {
    var iframe_url = this.getIframeUrl(e.target);
    iframe_url = iframe_url.replace('autoplay=1', 'autoplay=0');
    iframe_url = iframe_url.replace('autohide=1', 'autohide=0');

    var iframe_code = '<iframe src="' + iframe_url + '" class="Pf" width="402" height="261" scrolling="auto" marginwidth="0" marginheight="0" frameborder="0"></iframe>';

    var code_viewer = '<textarea class="boah_embed_viewer">' + iframe_code + '</textarea>';
    code_viewer += '<p style="width: 400px;" ><strong>Copy and paste the code in the box to embed the live stream in a blog or other web page.</strong></p>';

    this.showShinyBox('Hangout Embed Code', code_viewer, e.target);
};

BetterOnAirHangouts.prototype.onStreamButtonClick = function(e) {
    var iframe_url = this.getIframeUrl(e.target);
    var stream_url = parseUri(iframe_url);
    stream_url = unescape(stream_url["queryKey"]["flvurl"]);

    var code_viewer = '<textarea class="boah_embed_viewer">' + stream_url + '</textarea>';
    code_viewer += '<p style="width: 400px;" ><strong>Copy and paste this URL into a media player like VLC to watch this stream outside of a browser.</strong></p>';

    this.showShinyBox('Video Stream URL', code_viewer, e.target);
};

BetterOnAirHangouts.prototype.findPost = function(node) {
    while (! $(node).hasClass("Te")) {
        node = node.parentNode;
    }
    return node;
};

BetterOnAirHangouts.prototype.createButtons = function(post) {
    var optionsDOM = post.querySelector('div.vo');
    if (optionsDOM) {
        optionsDOM.appendChild(document.createTextNode(' \u00a0-\u00a0 '));

        var helper_item = document.createElement('span');
        helper_item.setAttribute('class', 'boah_helper');
        helper_item.setAttribute('iframe-url');
        optionsDOM.appendChild(helper_item);

        var option_expand = document.createElement('img');
        option_expand.setAttribute('src', 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/img/expand.png');
        option_expand.setAttribute('class', 'c-C boah_menu_icon boah-menu-expand');
        $(option_expand).hide();
        option_expand.setAttribute('title', 'Expand Hangout Player');
        optionsDOM.appendChild(option_expand);
        option_expand.addEventListener('click', this.onExpandButtonClick.bind(this), false);

        optionsDOM.appendChild(document.createTextNode(' '));

        var option_new = document.createElement('img');
        option_new.setAttribute('src', 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/img/new.png');
        option_new.setAttribute('class', 'c-C boah_menu_icon boah-menu-new');
        $(option_new).hide();
        option_new.setAttribute('title', 'Open Hangout In New Tab');
        optionsDOM.appendChild(option_new);
        option_new.addEventListener('click', this.onNewTabButtonClick.bind(this), false);

        optionsDOM.appendChild(document.createTextNode(' '));

        var option_embed = document.createElement('img');
        option_embed.setAttribute('src', 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/img/embed.png');
        option_embed.setAttribute('class', 'c-C boah_menu_icon boah-menu-embed');
        $(option_embed).hide();
        option_embed.setAttribute('title', 'Get Hangout Embed Code');
        optionsDOM.appendChild(option_embed);
        option_embed.addEventListener('click', this.onEmbedButtonClick.bind(this), false);

        optionsDOM.appendChild(document.createTextNode(' '));

        var option_stream = document.createElement('img');
        option_stream.setAttribute('src', 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/img/stream.png');
        option_stream.setAttribute('class', 'c-C boah_menu_icon boah-menu-stream');
        $(option_stream).hide();
        option_stream.setAttribute('title', 'Get Hangout Stream URL');
        optionsDOM.appendChild(option_stream);
        option_stream.addEventListener('click', this.onStreamButtonClick.bind(this), false);
    }
}

BetterOnAirHangouts.prototype.onHangoutPostModified = function(e) {
    if (e.target.nodeName != "IFRAME") { return; }

    var postDOM = this.findPost(e.target);

    $("span.boah_helper", $(postDOM)).attr("iframe-url", e.target.getAttribute("src"));
    $(".boah-menu-new", $(postDOM)).show();
    $(".boah-menu-stream", $(postDOM)).show();
    $(".boah-menu-embed", $(postDOM)).show();
    $(".boah-menu-expand", $(postDOM)).show();

};

BetterOnAirHangouts.prototype.renderAllItems = function(subtreeDOM) {
    var queryDOM = typeof subtreeDOM == 'undefined' ? document : subtreeDOM;
    var items = queryDOM.querySelectorAll('div[id^="update"]');
    for (i in items) {
        this.renderItem(items[i]);
    }
};

BetterOnAirHangouts.prototype.renderItem = function(itemDOM)
{
    if (!itemDOM || !itemDOM.parentNode || itemDOM.innerText == '') {
        return;
    }

    var hangoutDOM = itemDOM.querySelector("img." + HANGOUT_IMAGE_CLASS);
    if (hangoutDOM) {
        var postDOM = this.findPost(hangoutDOM)
        var postSpan = postDOM.querySelector("span.fD7nue");
        var postLink = postSpan.querySelector("a");

        var updateId = postDOM.getAttribute("id");

        this.createButtons(postDOM);

        $.getJSON('http://betterhangouts.com/service/', {url:'plus.google.com/' + postLink.getAttribute("href"), from: "extension"}, function(data) {
            if (data.success == true) {
                var iframe_url = data.embed;
                iframe_url = iframe_url.replace('autoplay=0', 'autoplay=1');
                iframe_url = iframe_url.replace('autohide=0', 'autohide=1');

                $("span.boah_helper", $("#" + updateId)).attr("iframe-url", iframe_url);
                $(".boah-menu-new", $("#" + updateId)).show();
                $(".boah-menu-stream", $("#" + updateId)).show();
                $(".boah-menu-embed", $("#" + updateId)).show();
            }
            else {
            }
        })

        itemDOM.addEventListener('DOMNodeInserted', this.onHangoutPostModified.bind(this), false);
    }
};

var injection = new BetterOnAirHangouts();
injection.init();