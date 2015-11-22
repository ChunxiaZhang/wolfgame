var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rondeShema = new Schema({
    radio: Number,
    randomNum: Number,
    ennemiDegats: Number,
    playerDegats: Number
});
var combatSchema = new Schema({
    nom: String,
    habilete: Number,
    endurance: Number,
    rondes: [rondeShema]
});

var decisionSchema = new Schema({
    page: String,
    pageId: Number,
    sectionId: Number,
    valid: Boolean,
    text: String
});

var AvancementSchema = new Schema({
    pageId: Number,
    sectionId: Number,
    joueurId: Schema.Types.ObjectId,
    combats: combatSchema,
    decisionPossible: [decisionSchema]
});

module.exports = mongoose.model('Avancement', AvancementSchema);

