var Tag = Parse.Object.extend('Tag'),
		Bookmark = Parse.Object.extend('Bookmark');

// Check if name is set, and enforce uniqueness based on the name column.
Parse.Cloud.beforeSave('Tag', function(request, response) {
	if (!request.object.get('name')) {
		response.error('A Tag must have a name.');
	} else {
		var query = new Parse.Query(Tag);
		query.equalTo('name', request.object.get('name'));
		query.first({
			success: function(object) {
				if (!object) {
					response.success();
				} else {
					response.error('A Tag with this name already exists.');
				}
			},
			error: function(error) {
				response.error('Could not validate uniqueness for this Tag object.');
			}
		});
	}
});

Parse.Cloud.afterSave('Bookmark', function(request) {

	var tags = request.object.get('tags'),
			objects = [];

	for (var i = 0; i < tags.length; i++) {
		var tagObj = new Tag();
		tagObj.setACL(new Parse.ACL(request.user));
		tagObj.set('name', tags[i]);
		objects.push(tagObj);
	};
	Parse.Object.saveAll(objects, {
		success: function(list) { console.log('BIG SUCCESS'); },
		error: function(error) { console.error(error); }
	})

	// var query = new Parse.Query(Bookmark);
	// query.get(request.params.bookmarkId, {
	// 	success: function(object) { response.success(object.get('tags')); },
	// 	error: function(error) { response.error(error); }
	// });

});