
function getMarks(){
	var marksList = new Array(5);
	var total = 0, average=0, count=1;
	for(var i = 0; i <marksList.length; i++){
		   marksList[i] = parseInt(prompt("Enter mark #"+ count +":"));
		   total = marksList[i] + parseInt(total);
		   count++;
		   
	 }

		   document.getElementById("sum").innerHTML="The total of the entered marks is " + total;
		   average = total/5;
		   document.getElementById("average").innerHTML= "The average of the entered marks is " + average;

}