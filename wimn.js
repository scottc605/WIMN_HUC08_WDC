(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "huc8",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "watershedCode",
            alias: "dnrcode",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "watershedDescription",
            alias: "HucDescription",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "watershedName",
            dataType: tableau.dataTypeEnum.string
        }, {
			id: "watershedUrl",
			dataType: tableau.dataTypeEnum.string
		}];

        var tableSchema = {
            id: "watersheds",
            alias: "Watershed list from WIMN",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("http://services.pca.state.mn.us/api/v1/wimn/watersheds?format=JSON", function(resp) {
            var feat = resp.data,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "huc8": feat[i].huc8,
                    "watershedCode": feat[i].watershedCode,
                    "watershedDescription": feat[i].watershedDescription,
                    "watershedName": feat[i].watershedName,
					"watershedUrl":feat[i].watershedUrl
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "WIMN Watersheds"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
