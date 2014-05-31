var Parse = require('parse').Parse;

Parse.initialize("DlpI4Ux0dRMxGE0WrzRV5cK1oz2MS5iefy3YSr47", "ig9VW0UUHOpODNcuJneWp9MEL4mdL9dN1J8smr4m");

module.exports = {
	Bookmark: Parse.Object.extend("Bookmark"),
	Tag: Parse.Object.extend("Tag")
};