exports.install = function () {
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

    MODULE('oauth2').redirect(type, CONFIG('oauth2.' + type + '.key'), "https://totalsocial-flashvnn-1.c9users.io/login/github/callback", self);
}

// Controller action
function oauth_login_callback() {
    var self = this;
    var type = self.req.path[1];
    var url = "https://totalsocial-flashvnn-1.c9users.io/login/github/callback";
    self.host('/login/' + type + '/callback/');
    MODULE('oauth2').callback(type, CONFIG('oauth2.' + type + '.key'), CONFIG('oauth2.' + type + '.secret'), url, self, function (err, profile, access_token) {
        console.log(profile);

        var email = profile.email;
        var name = profile.name;
        var nosql = NOSQL('users');
        nosql.find().make(function (builder) {
            builder.first();
            builder.where('email', email);
            builder.callback(function (err, response) {
                var id;
                if (!response) {
                    var profiles = [];
                    profiles['github'] = profile;
                    id = UID();
                    nosql.insert({id: id, email: email, name: name}).callback(NOOP);
                } else {
                    id = response.id;
                }
                self.cookie(F.config.cookie, F.encrypt({ id: id, ip: controller.ip }, 'user'), '5 minutes');
                callback(SUCCESS(true));
            });
        });
    });
}