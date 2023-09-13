Hey Shanna!
I spent a week developing an in-browser interactive general purpose unit-testing tool called "TestSuiteTools"
Here is how you can use it:

Open VsCode
Download "Live Server" by Ritwick Dey Extension so you can run the site on a server (it needs it because of CORS errors when accessing local files)
Open the "Website" folder above this directory in VSCode
Go to the html file named debug1_solutionWithTestSuite.html
Press the "Go Live" button in the bottom right hand corner of vsCode;
It should start with the test suite tool loaded
You can drag the window up by the top bar and expand the window so you can see more
press the "choose files" button;
navigate to the "src" folder in the website folder in this project.
go into the "TestSuite" folder
then go into the "TestKit" folder
then "TestKitTemplates"
then "Demo TestKits"
select all the files in that folder and press ok
the files will show in the testSuiteTools now
you can press on each one and run them, reset them (which clears the last test that was run on that Scenario), delete the testKit, or run all testkits by pressing runtestbed 
button.
you can press the view button next to the testkit run button to auto scroll down to the test result for that kit.

How it works:
TestScenarios store TestCases, TestCases have different expected inputs, outputs and errorTypes and the function that you want to test.
TestKits are basically templates that you can load from file to make a TestScenario.



it was lots of fun and i did it all in vanilla javascript, no frameworks, first time ive built something in Javascript so its pretty messy but i was also in a rush lol.
I am going to complete this project with a revised architecture, as you can see the presentation layer has over 1000 lines of code.
i have solved that problem with the PresentationLayerElementUnits which you can see a test demo of in the "Testing" folder.

thanks for being such a great teacher, i really enjoy our leassons, sorry this assignment was a day late.

Kind regards,

Dan.
