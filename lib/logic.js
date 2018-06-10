/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A shipment has been received by an importer
 * @param {org.acme.propertyhandleregistry.AddLandDetails} InputData - the InputData transaction
 * @transaction
 */
function AddLandDetails(InputData) {
    var factory = getFactory();
    var NS = 'org.acme.propertyhandleregistry';
    
    var objProperty = factory.newResource(NS, 'Property', InputData.propertyId);
    objProperty.length = InputData.length;
    objProperty.width = InputData.width;
    objProperty.longitude = InputData.longitude;
    objProperty.latitude = InputData.latitude;
    objProperty.information = InputData.information;
    objProperty.owner = factory.newRelationship(NS, 'Proprietor', InputData.owner.$identifier);
    
    return getAssetRegistry(NS + '.Property')
        .then(function (LandRegistry) {
            // add the propertydetails
            return LandRegistry.addAll([objProperty]);
        });
        
}

/**
 * A temperature reading has been received for a shipment
 * @param {org.acme.propertyhandleregistry.TransferOwnership} InputData - the InputData transaction
 * @transaction
 */
function TransferOwnership(InputData) {
    var factory = getFactory();
    var NS = 'org.acme.propertyhandleregistry';
    var propertydetails = InputData.propertydetails;
	var newowner = InputData.newowner;
    
    console.log('Adding ownership of property ' + propertydetails.$identifier + ' new owner : ' + newowner.$identifier );
    //console.log(newowner);
    //console.log(propertydetails);
  
  	propertydetails.owner = factory.newRelationship(NS, 'Proprietor', newowner.$identifier);
   
    return getAssetRegistry('org.acme.propertyhandleregistry.Property')
        .then(function (ProRegistry) {
            // add the new owner in the property details entry
            return ProRegistry.update(propertydetails);
        });
}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.acme.propertyhandleregistry.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
function setupDemo(setupDemo) {

    var factory = getFactory();
    var NS = 'org.acme.propertyhandleregistry';

    // create the proprietor
    var objPerson1 = factory.newResource(NS, 'Proprietor', 'P_101');
    objPerson1.firstname = 'Amruta';
    objPerson1.lastname = 'Ghodke';
    objPerson1.emailid = 'amrutaghodke22@gmail.com';
    objPerson1.gender = 'F';
    objPerson1.govtId = '1-1-1';
    objPerson1.dob = '6/18/1992';
    objPerson1.address = 'India';
    objPerson1.contactno = 1234567;

    // create the property
    var objProperty = factory.newResource(NS, 'Property', 'PRO_101');
    objProperty.length = 12;
    objProperty.width = 21;
    objProperty.longitude = 13;
    objProperty.latitude = 31;
    objProperty.information = "Home resident";
    objProperty.owner = factory.newRelationship(NS, 'Proprietor', 'P_101');
    
    return getParticipantRegistry(NS + '.Proprietor')
        .then(function (PersonRegistry) {
            // add the proprietor
            return PersonRegistry.addAll([objPerson1]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Property');
        })
        .then(function(LandRegistry) {
            // add the property
            return LandRegistry.addAll([objProperty]);
        });

}