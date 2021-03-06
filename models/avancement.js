var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rondeShema = new Schema({
    radio: Number,
    randomNum: Number,
    ennemiDegats: Number,
    playerDegats: Number
});

var decisionSchema = new Schema({
    page: String,
    pageId: Number,
    sectionId: Number,
    isValid: Boolean,
    text: String
});

var AvancementSchema = new Schema({
    pageId: Number,
    sectionId: Number,
    joueurId: Schema.Types.ObjectId,
    combats: {
        nom: String,
        habilete: Number,
        endurance: Number,
        rondes: [rondeShema]
    },
    decisionPossible: [decisionSchema]
});

module.exports = mongoose.model('Avancement', AvancementSchema);

