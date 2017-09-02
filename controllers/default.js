exports.install = function() {
	F.route('/', view_index);
    F.route('/login/github/', oauth_login, ['unauthorize']);
    F.route('/login/github/callback/', oauth_login_callback, ['unauthorize']);
};

function view_index() {
	var self = this;
	self.view('index');
}

// Controller action
function oauth_login() {
    var self = this;
    var type = self.req.path[1];

    // config:
    // oauth2.google.key =
    // oauth2.google.secret =
    // oauth2.github.key =
    // oauth2.github.secret =
    // ...

    MODULE('oauth2').redirect(type, CONFIG('oauth2.' + type + '.key'), self.host('/login/' + type + '/callback/'), self);
}

// Controller action
function oauth_login_callback() {
    var self = this;
    var type = self.req.path[1];
    var url = self.host('/login/' + type + '/callback/');

    // config:
    // oauth2.google.key =
    // oauth2.google.secret =
    // oauth2.github.key =
    // oauth2.github.secret =
    // ...

    MODULE('oauth2').callback(type, CONFIG('oauth2.' + type + '.key'), CONFIG('oauth2.' + type + '.secret'), url, self, function(err, profile, access_token) {
        console.log(profile);
        self.json(SUCCESS(true));
    });
}