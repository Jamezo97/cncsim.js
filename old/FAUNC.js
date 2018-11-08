
	function Circle(x, y, r)
	{
        this.type = 'circle';
        this.x = x;
        this.y = y;
        this.r = r;
        
        this.intersects = function(shape2)
        {
            if(shape2.type == 'line')
            {
                return intersectCircleLine(this, shape2);
            }
            else if(shape2.type == 'circle')
            {
                return intersectCircleCircle(this, shape2);
            }
        }
	}
	
	function Line(x, y, gX, gY)
    {
        this.type = 'line';
        this.x = x;
        this.y = y;
        this.gX = gX;
        this.gY = gY;
        
        this.intersects = function(shape2)
        {
            if(shape2.type == 'line')
            {
                return intersectLineLine(this, shape2);
            }
            else if(shape2.type == 'circle')
            {
                return intersectCircleLine(shape2, this);
            }
        }
    }

	
	function intersectLineLine(l1, l2)
	{
		var t = (l2.gY*(l1.x - l2.x) - l1.y*l2.gX + l2.y*l2.gX)/(l1.gY*l2.gX - l1.gX*l2.gY);		
		return [l1.x+l1.gX*t, l1.y+l1.gY*t];
	}


    function intersectCircleLine(c1, l1)
	{	
        //t = (-1/2 sqrt((-2 a e - 2 b f + 2 c e + 2 d f)^2 - 4 (e^2 + f^2) (a^2 - 2 a c + b^2 - 2 b d + c^2 + d^2 - r^2)) + a e + b f - c e - d f)/(e^2 + f^2)
        //t = ( 1/2 sqrt((-2 a e - 2 b f + 2 c e + 2 d f)^2 - 4 (e^2 + f^2) (a^2 - 2 a c + b^2 - 2 b d + c^2 + d^2 - r^2)) + a e + b f - c e - d f)/(e^2 + f^2)
        
        
        
		var tmp = -2*c1.x*l1.gX - 2*c1.y*l1.gY + 2*l1.x*l1.gX + 2*l1.y*l1.gY;
		var a = l1.gX*l1.gX + l1.gY*l1.gY;
        var tmp2 = 0.5*Math.sqrt(tmp*tmp - 4*(a)*(c1.x*c1.x - 2*c1.x*l1.x + c1.y*c1.y - 2*c1.y*l1.y + l1.x*l1.x + l1.y*l1.y - c1.r*c1.r));
        var tmp3 = c1.x*l1.gX + c1.y*l1.gY - l1.x*l1.gX - l1.y*l1.gY;
		var t1 = ( tmp2 + tmp3)/(a);
		var t2 = (-tmp2 + tmp3)/(a);

		return [l1.x + l1.gX*t2, l1.y + l1.gY*t2, l1.x + l1.gX*t1, l1.y + l1.gY*t1];
	}
	
	function intersectCircleCircle(c1, c2)
	{	
		var dx = c2.x-c1.x;
		var dy = c2.y-c1.y;
		var centerDistance = Math.sqrt(dx*dx + dy*dy);
		
		var v1x = dx / centerDistance;
		var v1y = dy / centerDistance;
		
		var percentBetween = (centerDistance*centerDistance - c2.r*c2.r + c1.r*c1.r) / (2*centerDistance);
		
		var l1 = new Line(v1x*percentBetween + c1.x, v1y*percentBetween + c1.y, v1y, -v1x);
		
		return intersectCircleLine(c1, l1);
	}            



            function CNCCodeStyler()
            {
                this.styles = {};
                this.defaultStyle = "color: 000000";
                
                this.styles['M'] = "color: #9731b1; font-weight: bold;";
                this.styles['G'] = "color: #3399EE; font-weight: bold;";
                this.styles['T'] = "color: #CC2222; font-weight: bold;";
                this.styles['S'] = "color: #7d8a28;";
                this.styles['F'] = "color: #8a6428;";
                this.styles['O'] = "color: #327b54;";
                
                this.styles['X'] = "color: #AA0000;";
                this.styles['Y'] = "color: #00AA00;";
                this.styles['Z'] = "color: #0000AA;";
                
                this.styles['I'] = "color: #00AAAA;";
                this.styles['J'] = "color: #AA00AA;";
                this.styles['K'] = "color: #AAAA00;";
                
                
                
            }
            
            function GMCodeLine(lineString)
            {
                this.originalString = lineString;
                
                this.commands = [];
                
                this.toHTML = function()
                {
                    var htmlString = "";
                    for(var i = 0; i < this.commands.length; i++)
                    {
                        var code = this.commands[i].charAt(0);
                        var format = defaultCodeStyler.styles[code];
                        if(format === undefined || format === null)
                        {
                            format = defaultCodeStyler.defaultStyle;
                        }
                        
                        var partB = this.commands[i].substr(1);
                        
                        if(i != 0) htmlString += " ";
                        htmlString += "<span style='" + format + "'>" + code + partB + "</span>";
                    }
                    return htmlString;
                }
                
                this.addCommand = function(command)
                {
                    if(command !== undefined && command !== null && command.length > 1)
                    {
                        this.commands.push(command);
                    }
                }
                
                this.parse = function(line)
                {
                    var bracketCommentIndent = 0;
                    
                    var currentCommand = "";
                    
                    for(var i = 0; i < line.length; i++)
                    {
                        var c = line.charAt(i);
                        
                        //Ignore comments
                        if(c == '/')
                        {
                            if(i > 0 && line.charAt(i-1) == '/')
                            {
                                break;
                            }
                            continue;
                        }
                        else if(c == ';')
                        {
                            break;
                        }
                        else if(c == '(')
                        {
                            bracketCommentIndent++;
                            continue;
                        }
                        else if(c == ')' && bracketCommentIndent > 0)
                        {
                            bracketCommentIndent--;
                            continue;
                        }
                        else if(bracketCommentIndent == 0)
                        {
                            switch(c)
                            {
                                case 'N': 
                                case 'G':
                                case 'M':
                                    
                                case 'X':
                                case 'Y':
                                case 'Z':
                                case 'I':
                                case 'J':
                                case 'K':
                                    
                                case 'R':
                                case 'D':
                                case 'P':
                                case 'L': 
                                case 'S': 
                                case 'F': 
                                case 'H': 
                                case 'O': 
                                    {
                                        
                                        this.addCommand(currentCommand);
                                        currentCommand = "" + c;
                                        break;
                                    }
                                case ' ': {continue;}
                                default:
                                    {
                                        currentCommand += c;
                                        break;
                                    }
                            }
                        }
                    }
                    
                    this.addCommand(currentCommand);
                    
                    //console.log(this.commands);
                
                }
                
                this.parse(this.originalString);
            }

           
            
            function getIntersectionPoint(a, b, c, d, clockwise, r)
            {
                r += 0.000001 * Math.signum(r); //To overcome errors with floating point numbers
                
                var x1, y1, x2, y2;
                
                var interDistSq = aMc*aMc + bMd*bMd;	//DistanceSq between points
                var rSq2 = r*r * 4;	//Diameter Squared

                if(Math.abs(interDistSq - rSq2) < 0.00001) //Bloody close enough. "Engineering is the art of approximation"
                {
                    return [(a+c)/2.0 + lA, (b+d)/2.0 + lB];
                }
                else if(interDistSq > rSq2)
                {
                    //There's no intersection point
                    return null;
                }
                
                if(true)
                {
                    var intersect = intersectCircleCircle(new Circle(a, b, Math.abs(r)), new Circle(c, d, Math.abs(r)));
                    
                    x1 = intersect[0];
                    y1 = intersect[1];
                    x2 = intersect[2];
                    y2 = intersect[3];
                }
                else
                {
                    var lA = a;
                    var lB = b;

                    a-= lA;
                    b-= lB;
                    c-= lA;
                    d-= lB;


                    var aMc = a - c;
                    var bMd = b - d;

                    var interDistSq = aMc*aMc + bMd*bMd;	//DistanceSq between points
                    var rSq2 = r*r * 4;	//Diameter Squared

                    if(Math.abs(interDistSq - rSq2) < 0.00001) //Bloody close enough. "Engineering is the art of approximation"
                    {
                        return [(a+c)/2.0 + lA, (b+d)/2.0 + lB];
                    }
                    else if(interDistSq > rSq2)
                    {
                        //There's no intersection point
                        return null;
                    }


                    if(Math.abs(c-a) < 0.00001) //Same X
                    {
                        y1 = y2 = (d+b)/2.0;
                        var dy = Math.max(b, d) - y1;
                        x1 = Math.sqrt(r*r-dy*dy);
                        x2 = -x1;
                        x1 += a;
                        x2 += a;
                    }
                    else if(Math.abs(d-b) < 0.00001) //Same Y
                    {
                        x1 = x2 = (c+a)/2.0;
                        var dx = Math.max(a, c) - x1;
                        y1 = Math.sqrt(r*r-dx*dx);
                        y2 = -y1;
                        y1 += b;
                        y2 += b;
                    }
                    else
                    {
                        var bSq = b*b;
                        var dSq = d*d;

                        var g = a*a + b*b + c*c + d*d - 2*a*c - 2*b*d;

                        var A1 = a*a*a;
                        var A2 = Math.sqrt(-bMd*bMd*(g)*(g - 4*r*r));
                        var A3 = - a*a*c + a*bSq - 2*a*b*d - a*c*c + a*dSq + bSq*c - 2*b*c*d + c*c*c + c*dSq;

                        var B1 = a*Math.sqrt(-bMd*bMd*(g)*(g - 4*r*r));
                        var B2 = c*Math.sqrt(-bMd*bMd*(g)*(g - 4*r*r));
                        var B3 = a*a * bSq - a*a * dSq - 2*a*bSq*c + 2*a*c*dSq + bSq*bSq - 2*bSq*b*d + bSq*c*c + 2*b*d*dSq - c*c*dSq - dSq*dSq;

                        x1 = (A1 - A2 + A3)/(2*g);
                        y1 = (B1 - B2 + B3)/(2*g*bMd);

                        x2 = (A1 + A2 + A3)/(2*g);
                        y2 = (B1 + B2 + B3)/(2*g*bMd);
                    }
                }
                
                


                
                
                

                //Which one to choose?
                //By default, we want to choose the one with the smallest arc length.
                //For Clockwise Rotation, this is the point to the right of the line AB
                //For Counterclockwise Rotation, this is the point to the left of the line AB

                var dist1 = (x1-a)*(d-b) - (y1-b)*(c-a); //Positive means point 1 is to the left of line AB

                var lineSide = clockwise && r > 0 || !clockwise && r < 0; //XOR CCW and Negative Radius

                if((lineSide && dist1 > 0) || (!lineSide && dist1 < 0))
                {
                    //return [x1 + lA, y1 + lB];
                    return [x1, y1];
                }
                else
                {
                    //return [x2 + lA, y2 + lB];
                    return [x2, y2];
                }
            }
            
            function ToolPathCCWCWLineSegment(startX, startY, startZ, endX, endY, endZ, centrepoint, clockwise, radius, feedRate)
            {
                this.startX = startX;
                this.startY = startY;
                this.startZ = startZ;
                this.endX = endX;
                this.endY = endY;
                this.endZ = endZ;
                
                this.radi = Math.abs(radius);
                this.len = 0;
                this.cw = clockwise;
                
                this.cp = centrepoint;//[0, 0];
                
                this.startAngle = 0;
                this.endAngle = 0;
                this.deltaAngle = 0;
                
                this.feedRate = feedRate;
                
                {
                    if(this.cp == null || this.cp == undefined)
                    {
                        this.cp = getIntersectionPoint(startX, startY, endX, endY, clockwise, radius);
                    }
                    console.log(startX + ", " + startY + ", " + endX + ", " + endY + ", " + clockwise + ", " + radius);
                    console.log(this.cp);
                    if(this.cp != null)
                    {
                        this.startAngle = Math.atan2(startY - this.cp[1], startX - this.cp[0]);
                        this.endAngle = Math.atan2(endY - this.cp[1], endX - this.cp[0]);
                     
                        if(this.endAngle < this.startAngle && !clockwise)
                        {
                            this.endAngle += Math.PI*2;
                        }
                        if(clockwise)
                        {
                            this.deltaAngle = this.startAngle - this.endAngle;
                        }
                        else
                        {
                            this.deltaAngle = this.endAngle - this.startAngle;
                        }
                        
                        this.len = this.deltaAngle * this.radi;
                    }
                }
                
                this.currentDist = 0;
                
                this.getPoint = function(deltaTime)
                {
                    this.currentDist += deltaTime * this.feedRate;
                    
                    if(this.currentDist > this.len)
                    {
                        this.currentDist = this.len;
                        console.warn("Exceeded Path Length");
                    }
                    
                    var angle = 0;
                    
                    if(this.cw)
                    {
                        angle = this.startAngle - this.currentDist / this.radi;
                    }
                    else
                    {
                        angle = this.startAngle + this.currentDist / this.radi;
                    }
                    
                    return [this.cp[0] + Math.cos(angle) * this.radi, this.cp[1] + Math.sin(angle) * this.radi, this.startZ + (this.endZ-this.startZ)*(this.currentDist / this.len)];
                }
                
                this.hasError = function()
                {
                    return this.cp == null || isNaN(this.cp[0]) || isNaN(this.cp[1]);
                }
                
                this.getRemainingPathTime = function()
                {
                    return Math.max(0, Math.min(this.len, this.len - this.currentDist)) / this.feedRate;
                }
                
            }
            
            
            function ToolPathLineSegment(startX, startY, startZ, endX, endY, endZ, feedRate)
            {
                this.startX = startX;
                this.startY = startY;
                this.startZ = startZ;
                this.endX = endX;
                this.endY = endY;
                this.endZ = endZ;
                
                this.feedRate = feedRate;
                
                this.vX = endX - startX;
                this.vY = endY - startY;
                this.vZ = endZ - startZ;
                
                var len = Math.sqrt(this.vX*this.vX+this.vY*this.vY+this.vZ*this.vZ);
                
                this.vX /= len;
                this.vY /= len;
                this.vZ /= len;
                
                this.currentDist = 0;
                
                this.hasError = function()
                {
                    return false;
                }
                
                this.getPoint = function(deltaTime)
                {
                    this.currentDist += deltaTime * this.feedRate;
                    
                    if(this.currentDist > len)
                    {
                        this.currentDist = len;
                        console.warn("Exceeded Path Length");
                    }
                    
                    return [this.startX + this.vX*this.currentDist, this.startY + this.vY*this.currentDist, this.startZ + this.vZ*this.currentDist];
                }
                
                this.getRemainingPathTime = function()
                {
                    return Math.max(0, Math.min(len, len - this.currentDist)) / this.feedRate;
                }
            }
            
                        
            function FAUNC_State()
            {
                
                
                this.currentLine = 0;
                
                this.incrementalMode = false;
                this.imperialUnits = false;
                this.polarCoordsOn = false;
                
                this.polarCoordsCenter = [0, 0, 0];
                this.polarCoordsLenRot = [0, 0];
                
                this.drillReturn = 0;
                this.cutterCompensation = 0; //-1 = Left, 0 = Off, +1 = Right
                
                this.feedRate = 2; //2 mm/sec
                this.spindleSpeed = 1000; //1000 RPM
                this.spindleDirection = 0; //CCW=-1    OFF= 0  CW=+1
                
                this.currentGMoveCommand = -1;
                
                this.programReturnStack = [];
                this.programLoopRemainingStack = [];
                this.programCurrent = [];
                this.pos = [200, 200, 200];
                this.commandedPos = [200, 200, 200];
                this.toolHome = [200, 200, 200];
                this.zeroOffset = [0, 0, 0];
                
                this.currentTool = {i: -1, d: 10, l: 50, t: 'mill'};
                this.selectedTool = this.currentTool;
            }

            function MoveCommand(moveType, startPos, endPos, startCommand, endCommand, radius, feed, compensationStart, compensationEnd)
            {
                this.moveType = moveType;
                
                //MUST START FROM THIS POSITION
                this.startPos = [startPos[0], startPos[1], startPos[2]];
                
                //This may change, if CCompensation is enabled
                this.endPos = [endPos[0], endPos[1], endPos[2]];
                
                //Without compensation, this should equal the start/end pos.
                //With compensation enabled, this is the edge of the part, not compensated
                this.startCommand = [startCommand[0], startCommand[1], startCommand[2]];
                this.endCommand = [endCommand[0], endCommand[1], endCommand[2]];
                
                //Radius of cut, if this is an arc move command
                this.radius = radius;
                this.feedRate = feed;
                
                //Cutter compensation, at beginning of move
                this.compensationStart = compensationStart;
                
                //Cutter compensation, at end of move
                this.compensationEnd = compensationEnd;
                
                this.getCompensatedShape = function(radius)
                {
                    var comp = 0;
                    if(this.compensationStart == this.compensationEnd)
                    {
                        comp = this.compensationStart;
                    }
                    
                    if(this.moveType == 0 || this.moveType == 1)
                    {
                        //Find the vector between the two points
                        var AB = (new Vec3(this.endCommand)).subtract(new Vec3(this.startCommand)).normalize();
                        
                        //Find the perpendicular vector
                        var ABPERP = AB.cross(new Vec3([0, 0, 1])); //A line going straight up, will have a perp line to the right
                        
                        //Now recalculate the start and end positions of the line
                        var start = (new Vec3(this.startCommand)).add(ABPERP.mult(radius * comp));
                        var end = (new Vec3(this.endCommand)).add(ABPERP.mult(radius * comp));
                        var dirVec = end.subtract(start).normalize();
                        return new Line(start.data[0], start.data[1], dirVec.data[0], dirVec.data[1]);
                        //return new ShapeLine(start, (end.subtract(start).angleXY()));
                    }
                    else if(this.moveType == 2 || this.moveType == 3)
                    {
                        if(comp == 0) return new Circle(centre.data[0], centre.data[1], this.radius);
                        var addRadius = (this.moveType==2 && this.compensationStart==-1) || (this.moveType==3&&this.compensationStart==1);
                        
                        var cp = getIntersectionPoint(this.startCommand[0], this.startCommand[1], this.endCommand[0], this.endCommand[1], this.moveType==2, this.radius);
                        var centre = new Vec3([cp[0], cp[1], 0]);
                        return new Circle(centre.data[0], centre.data[1], this.radius + (addRadius?radius:-radius));
                        //return new ShapeCircle(centre, this.radius + (addRadius?radius:-radius));
                    }
                }
                
                this.generateMove = function(toolRadius)
                {
                    var radius = this.radius;
                    var cp;
                    if(this.compensationStart != 0 && (this.moveType == 2 || this.moveType == 3))
                    {
                        cp = getIntersectionPoint(this.startCommand[0], this.startCommand[1], this.endCommand[0], this.endCommand[1], this.moveType==2, this.radius);
                        var dx = (this.startPos[0] - cp[0]);
                        var dy = (this.startPos[1] - cp[1]);
                        radius = Math.sqrt(dx*dx+dy*dy);
                        
                        //var addRadius = (this.moveType==2 && this.compensationStart==-1) || (this.moveType==3&&this.compensationStart==1);
                        //radius += (addRadius?toolRadius:-toolRadius);
                        //console.log("CIRCLE " + JSON.stringify(this));
                    }
                    
                    switch(this.moveType)
                    {
                        case 0:{
                            return new ToolPathLineSegment(
                                this.startPos[0], this.startPos[1], this.startPos[2], 
                                this.endPos[0], this.endPos[1], this.endPos[2], SETTINGS.g0speed/60.0);
                        } break;
                        case 1:{
                            return new ToolPathLineSegment(
                                this.startPos[0], this.startPos[1], this.startPos[2], 
                                this.endPos[0], this.endPos[1], this.endPos[2], this.feedRate);
                        } break;
                        case 2:{    //CW
                            if(this.radius != undefined)
                            {
                                return new ToolPathCCWCWLineSegment(
                                    this.startPos[0], this.startPos[1], this.startPos[2], 
                                    this.endPos[0], this.endPos[1], this.endPos[2], cp, true, radius, this.feedRate);
                            }else console.warn("Radius not defined");
                        } break;
                        case 3:{    //CCW
                            if(this.radius != undefined)
                            {
                                return new ToolPathCCWCWLineSegment(
                                    this.startPos[0], this.startPos[1], this.startPos[2], 
                                    this.endPos[0], this.endPos[1], this.endPos[2], cp, false, radius, this.feedRate);
                            }else console.warn("Radius not defined");
                        } break;
                    }
                    console.warn("Tool Path not created");
                }
                
            }

            function FAUNC()
            {
                this.state = new FAUNC_State();
                
                this.commandLinesBuffer = [];
                this.programLineStarts = {};
                
                this.definedWorkpiece = [200, 200, 20, 0, 0, 0];
                this.definedTools = {};
                
                this.parseCommandBuffer = function(code)
                {
                    this.commandLinesBuffer = [];
                    this.programLineStarts = {};
                    
                    var lines = code.split("\n");
                    
                    for(var lineIndex = 0; lineIndex < lines.length; lineIndex++)
                    {
                        if(lines[lineIndex].trim().startsWith("##"))
                        {
                            //Pre Processor
                            var setupStatement = lines[lineIndex].trim().substr(2).toLowerCase();
                            var chunks = setupStatement.split(" ");
                            if(chunks.length > 1)
                            {
                                if(chunks[0] == "workpiece" && chunks.length >= 4)
                                {
                                    var xSize = chunks[1];
                                    var ySize = chunks[2];
                                    var zSize = chunks[3];
                                    var startX = 0;
                                    var startY = 0;
                                    var startZ = 0;
                                    
                                    if(chunks.length >= 7)
                                    {
                                        startX = chunks[4];
                                        startY = chunks[5];
                                        startZ = chunks[6];
                                    }
                                    
                                    this.definedWorkpiece[0] = xSize;
                                    this.definedWorkpiece[1] = ySize;
                                    this.definedWorkpiece[2] = zSize;
                                    this.definedWorkpiece[3] = startX;
                                    this.definedWorkpiece[4] = startY;
                                    this.definedWorkpiece[5] = startZ;
                                }
                                else if(chunks[0] == "tool" && chunks.length >= 3)
                                {
                                    var toolIndex = Number(chunks[1]);
                                    var toolDiam = Number(chunks[2]);
                                    var toolLength = 50;
                                    var toolType = 'mill';
                                    
                                    if(chunks.length >= 4) toolLength = Number(chunks[3]);
                                    if(chunks.length >= 5) toolType = chunks[4];
                                    
                                    this.definedTools[toolIndex] = {i: toolIndex, d: toolDiam, l: toolLength, t: toolType};
                                    
                                    if(this.state.currentTool == null)
                                    {
                                        this.state.currentTool = this.definedTools[toolIndex];
                                        this.state.selectedTool = this.state.currentTool;
                                    }
                                }
                                else if(chunks[0] == "toolhome" && chunks.length >= 4)
                                {
                                    var x = Number(chunks[1]);
                                    var y = Number(chunks[2]);
                                    var z = Number(chunks[3]);
                                    
                                    this.state.toolHome = [x, y, z];
                                    this.state.pos[0] = x;
                                    this.state.pos[1] = y;
                                    this.state.pos[2] = z;
                                }
                            }
                        }
                        else
                        { 
                            var gmCode = new GMCodeLine(lines[lineIndex]);

                            //If it's the start of a program, remember the location
                            if(gmCode.commands.length == 1 && gmCode.commands[0].charAt(0) == "O")
                            {
                                var data = Number(gmCode.commands[0].substr(1));
                                if(this.programLineStarts[data] != undefined)
                                {
                                    console.warn("Duplicate program identifiers: " + data);
                                }
                                this.programLineStarts[data] = this.commandLinesBuffer.length;
                            }
                            
                            this.commandLinesBuffer.push(gmCode);
                            
                        }
                    }
                }
                
                this.currentPath = null;
                
                //Travels the tool along the current path by the given distance
                this.travelPath = function(dt)
                {
                    //If there is no current path, then we go nowhere
                    if(this.currentPath == null || this.currentPath == undefined || dt <= 0 || this.currentPath.length == 0) return dt;
                    
                    
                    while(this.currentPath != null && dt > 0)
                    {
                        var path = this.currentPath[0];
                        
                        if(path.hasError())
                        {
                            this.currentPath.shift();
                            if(this.currentPath.length == 0)
                            {
                                this.currentPath = null;
                            }
                        }
                        else
                        {
                            //If there is a path, then work out the maximum we can move along it
                            var pathRemaining = path.getRemainingPathTime();
                            var toMove = Math.min(pathRemaining, dt);

                            if(toMove > 0)
                            {
                                var newPoint = path.getPoint(toMove);

                                this.state.pos[0] = newPoint[0];
                                this.state.pos[1] = newPoint[1];
                                this.state.pos[2] = newPoint[2];

                                dt -= toMove;
                            }

                            if(pathRemaining == toMove)
                            {
                                this.currentPath.shift();
                                if(this.currentPath.length == 0)
                                {
                                    this.currentPath = null;
                                }
                            }
                        }
                        
                        
                        
                    }
                    
                    return dt;
                }
                
                this.currentMoveCommand = null;
                
                this.getNewPos = function(newValsXYZ, oldValsLenRot, oldValsXYZ, incremental)
                {
                    if(incremental == null || incremental == undefined) incremental = this.state.incrementalMode;
                    
                    var newPos = [0, 0, 0];
                    var newLenRot = [0, 0];
                    
                    if(this.state.polarCoordsOn)
                    {
                        if(newValsXYZ[0] == null || newValsXYZ[0] == undefined) {newValsXYZ[0] = (incremental?0:oldValsLenRot[0]); }
                        if(newValsXYZ[1] == null || newValsXYZ[1] == undefined) {newValsXYZ[1] = (incremental?0:oldValsLenRot[1]); }
                        if(newValsXYZ[2] == null || newValsXYZ[2] == undefined) {newValsXYZ[2] = (incremental?0:oldValsXYZ[2]); }
                        if(incremental)
                        {
                            newLenRot[0] = oldValsLenRot[0] + newValsXYZ[0];
                            newLenRot[1] = oldValsLenRot[1] + newValsXYZ[1];// / 180.0 * Math.PI;
                            newPos[0] = newLenRot[0] * Math.cos(newLenRot[1] / 180.0 * Math.PI) + this.state.polarCoordsCenter[0] + this.state.toolHome[0] - this.state.zeroOffset[0];
                            newPos[1] = newLenRot[0] * Math.sin(newLenRot[1] / 180.0 * Math.PI) + this.state.polarCoordsCenter[1] + this.state.toolHome[1] - this.state.zeroOffset[1];
                            newPos[2] = oldValsXYZ[2] + newValsXYZ[2];
                        }
                        else
                        {
                            newLenRot[0] = newValsXYZ[0];
                            newLenRot[1] = newValsXYZ[1];// / 180.0 * Math.PI;
                            
                            newPos[0] = newLenRot[0] * Math.cos(newLenRot[1] / 180.0 * Math.PI) + this.state.polarCoordsCenter[0] + this.state.toolHome[0] - this.state.zeroOffset[0];
                            newPos[1] = newLenRot[0] * Math.sin(newLenRot[1] / 180.0 * Math.PI) + this.state.polarCoordsCenter[1] + this.state.toolHome[1] - this.state.zeroOffset[1];
                            newPos[2] = newValsXYZ[2] + this.state.toolHome[2] - this.state.zeroOffset[2];
                        }
                    }
                    else
                    {
                        if(newValsXYZ[0] == null || newValsXYZ[0] == undefined) {newValsXYZ[0] = (incremental?0:oldValsXYZ[0]); }
                        if(newValsXYZ[1] == null || newValsXYZ[1] == undefined) {newValsXYZ[1] = (incremental?0:oldValsXYZ[1]); }
                        if(newValsXYZ[2] == null || newValsXYZ[2] == undefined) {newValsXYZ[2] = (incremental?0:oldValsXYZ[2]); }
                        if(incremental)
                        {
                            newPos[0] = oldValsXYZ[0] + newValsXYZ[0];
                            newPos[1] = oldValsXYZ[1] + newValsXYZ[1];
                            newPos[2] = oldValsXYZ[2] + newValsXYZ[2];
                        }
                        else
                        {
                            newPos[0] = newValsXYZ[0] + this.state.toolHome[0] - this.state.zeroOffset[0];
                            newPos[1] = newValsXYZ[1] + this.state.toolHome[1] - this.state.zeroOffset[1];
                            newPos[2] = newValsXYZ[2] + this.state.toolHome[2] - this.state.zeroOffset[2];
                        }
                    }
                    return [newPos, newLenRot];
                }
                
                this.getXYZ = function(val, index)
                {
                    if(this.state.polarCoordsOn && index < 2)
                    {
                        if(index == 0)
                        {
                            return Math.cos(this.state.polarCoordsLenRot[1]*Math.PI/180.0) * this.state.polarCoordsLenRot[0]
                                + this.state.polarCoordsCenter[index] + this.state.toolHome[index] - this.state.zeroOffset[index];
                        }
                        else if(index == 1)
                        {
                            return Math.sin(this.state.polarCoordsLenRot[1]*Math.PI/180.0) * this.state.polarCoordsLenRot[0]
                                + this.state.polarCoordsCenter[index] + this.state.toolHome[index] - this.state.zeroOffset[index];
                        }
                    }
                    else
                    {
                        if(val == undefined) return this.state.commandedPos[index];
                        if(this.state.incrementalMode)
                        {
                            return this.state.commandedPos[index] + val;
                        }
                        return val + this.state.toolHome[index] - this.state.zeroOffset[index];
                    }
                    
                }
                
                this.calculateNewValue = function(oldValue, newValue, incremental, imperial)
                {
                    if(imperial) newValue = newValue * 25.4;
                    if(incremental) return oldValue + newValue;
                    return newValue;
                }

                this.warn = function(message)
                {
                    console.warn("At line " + (this.state.currentLine+1) + ": " + message);
                }
                
                
                
                this.findNextPath = function()
                {
                    //Parse the code until we find a move command.
                    for(; this.state.currentLine < this.commandLinesBuffer.length; this.state.currentLine++)
                    {
                        var line = this.commandLinesBuffer[this.state.currentLine];

                        var cachedValues = {};

                        var cachedGCommand = null;
                        var cachedMCommand = null;
                        
                        var cachedCompensationState = this.state.cutterCompensation;

                        var chosenNewXYZR = false;
                        
                        var newPolarLen = null;
                        var newPolarAngle = null;

                        //Parse the line. Most commands need to be executed at the end.
                        for(var i = 0; i < line.commands.length; i++)
                        {
                            var command = line.commands[i];
                            var codeLetter = command.charAt(0);
                            var data = Number(command.substr(1));

                            if(codeLetter == 'G' || codeLetter == 'M')
                            {
                                if(codeLetter == 'G')
                                {
                                    if((data >= 0 && data <= 3) || data == 92)
                                    {
                                        this.state.currentGMoveCommand = data;
                                    }
                                    else if(data == 81)
                                    {
                                        this.state.currentGMoveCommand = data;
                                    }
                                    else if(data == 90)
                                    {
                                        this.state.incrementalMode = false;
                                    }
                                    else if(data == 91)
                                    {
                                        this.state.incrementalMode = true;
                                    }
                                    else if(data == 20)
                                    {
                                        this.state.imperialUnits = true;
                                    }
                                    else if(data == 21)
                                    {
                                        this.state.imperialUnits = false;
                                    }
                                    else if(data == 40)
                                    {
                                        this.state.cutterCompensation = 0;
                                    }
                                    else if(data == 41)
                                    {
                                        this.state.cutterCompensation = -1;
                                    }
                                    else if(data == 42)
                                    {
                                        this.state.cutterCompensation = 1;
                                    }
                                    else if(data == 98)
                                    {
                                        this.state.drillReturn = 0; //Initial Point
                                    }
                                    else if(data == 99)
                                    {
                                        this.state.drillReturn = 1; //R Point
                                    }
                                    else if(data == 15)
                                    {
                                        this.state.polarCoordsOn = false;
                                    }
                                    else if(data == 16)
                                    {
                                        this.state.polarCoordsOn = true;
                                    }
                                }
                                else if(codeLetter == 'M')
                                {
                                    if(data == 98)
                                    {
                                        //Subprogram
                                        cachedMCommand = 98;
                                    }
                                    else if(data == 99)
                                    {
                                        //End Subprogram
                                        cachedMCommand = 99;
                                    }
                                    else if(data == 3)
                                    {
                                        this.state.spindleDirection = 1;
                                    }
                                    else if(data == 4)
                                    {
                                        this.state.spindleDirection = -1;
                                    }
                                    else if(data == 5)
                                    {
                                        this.state.spindleDirection = 0;
                                    }
                                    else if(data == 8)
                                    {
                                        this.state.coolantOn = true;
                                    }
                                    else if(data == 9)
                                    {
                                        this.state.coolantOn = false;
                                    }
                                    else if(data == 11)
                                    {
                                        cachedMCommand = 11;
                                    }
                                    else if(data == 2 || data == 30)
                                    {
                                        this.state.currentLine = this.commandLinesBuffer.length;
                                        break;
                                    }
                                }
                            }
                            else if(codeLetter == 'X')
                            {
                                cachedValues['X'] = data;
                                if(this.state.polarCoordsOn)
                                    newPolarLen = this.calculateNewValue(this.state.polarCoordsLenRot[0], data, this.state.incrementalMode, this.state.imperialUnits);
                            }
                            else if(codeLetter == 'Y')
                            {
                                cachedValues['Y'] = data;
                                if(this.state.polarCoordsOn)
                                    newPolarAngle = this.calculateNewValue(this.state.polarCoordsLenRot[1], data, this.state.incrementalMode, false);
                            }
                            else if(codeLetter == 'Z')
                            {
                                cachedValues['Z'] = data;
                            }
                            else if(codeLetter == 'R')
                            {
                                cachedValues['R'] = data;
                            }
                            else if(codeLetter == 'F')
                            {
                                this.state.feedRate = data / 60.0;
                            }
                            else if(codeLetter == 'S')
                            {
                                this.state.spindleSpeed = data;
                            }
                            else if(codeLetter == 'T')
                            {
                                var tool = this.definedTools[data];
                                if(tool == undefined)
                                {
                                    this.warn("Unknown tool '" + data + "'");
                                }
                                else
                                {
                                    this.state.selectedTool = tool;
                                }
                                cachedValues['T'] = data;
                            }
                            else if(codeLetter == 'P')
                            {
                                cachedValues['P'] = data;
                            }
                            else if(codeLetter == 'L')
                            {
                                cachedValues['L'] = data;
                            }
                            else if(codeLetter == 'I')
                            {
                                this.state.polarCoordsCenter[0] = data;
                            }
                            else if(codeLetter == 'J')
                            {
                                this.state.polarCoordsCenter[1] = data;
                            }
                            else if(codeLetter == 'K')
                            {
                                this.state.polarCoordsCenter[2] = data;
                            }
                        }
                        
                        if(cachedMCommand != undefined)
                        {
                            if(cachedMCommand == 98)
                            {
                                var repeat = cachedValues['L'];

                                if(repeat == undefined) repeat = 1;

                                if(repeat >= 1)
                                {
                                    var program = cachedValues['P'];

                                    if(this.programLineStarts[program] != undefined)
                                    {
                                        //Will jump to the O command. Then increments to first line
                                        this.state.programCurrent.push(program);
                                        this.state.programReturnStack.push(this.state.currentLine);
                                        this.state.programLoopRemainingStack.push(repeat-1);
                                        this.state.currentLine = this.programLineStarts[program];
                                    }
                                    else
                                    {
                                        this.warn("No program found: " + program);
                                    }
                                }
                                else
                                {
                                    this.warn("Subprogram execution count must be >= 1");
                                }
                            }
                            else if(cachedMCommand == 99)
                            {
                                if(this.state.programReturnStack.length > 0)
                                {
                                    var programDepth = this.state.programCurrent.length-1;
                                    var currentProgram = this.state.programCurrent[programDepth];

                                    var loopsRemaining = this.state.programLoopRemainingStack[programDepth];
                                    if(loopsRemaining < 1)
                                    {
                                        this.state.programCurrent.pop();
                                        this.state.programLoopRemainingStack.pop();
                                        var returnTo = this.state.programReturnStack.pop();

                                        this.state.currentLine = returnTo;
                                    }
                                    else
                                    {
                                        this.state.programLoopRemainingStack[programDepth]--;
                                        this.state.currentLine = this.programLineStarts[currentProgram];
                                    }
                                }
                                else
                                {
                                    this.warn("Not currently in sub program!");
                                }
                            }
                            else if(cachedMCommand == 11)
                            {
                                // Tool Change

                                if(this.state.currentTool != this.state.selectedTool)
                                {
                                    this.state.currentTool = this.state.selectedTool;
                                }
                                else
                                {
                                    this.warn("Called tool change on same tool " + this.state.currentTool.i);
                                }
                            }
                        }
                        else if(this.state.currentGMoveCommand != null)
                        {
                            //If we've chosen a new X Y or Z value
                            if(cachedValues['X'] != undefined || cachedValues['Y'] != undefined || cachedValues['Z'] != undefined)
                            {   
                                //console.log(this.state);
                                var x = this.getXYZ(cachedValues['X'], 0);
                                var y = this.getXYZ(cachedValues['Y'], 1);
                                var z = this.getXYZ(cachedValues['Z'], 2);

                                if(this.state.currentGMoveCommand >= 0 && this.state.currentGMoveCommand <= 3)
                                {
                                    if(newPolarLen != null) this.state.polarCoordsLenRot[0] = newPolarLen;
                                    if(newPolarAngle != null) this.state.polarCoordsLenRot[1] = newPolarAngle;
                                    
                                    var commands = [new MoveCommand(this.state.currentGMoveCommand, this.state.pos, [x, y, z], 
                                                            this.state.commandedPos, [x, y, z], 
                                                            cachedValues['R'], this.state.feedRate, cachedCompensationState, this.state.cutterCompensation)];
                                    
                                    //Update the commanded position
                                    this.state.commandedPos = [x, y, z];
                                    
                                    
                                    this.state.currentLine++;   //Ready for next line
                                    return commands;
                                }
                                else if(this.state.currentGMoveCommand == 81)
                                {
                                    var commands = [];
                                    
                                    var inputValuesXYZ = [0, 0, 0];
                                    inputValuesXYZ[0] = cachedValues['X'];
                                    inputValuesXYZ[1] = cachedValues['Y'];
                                    inputValuesXYZ[2] = cachedValues['Z'];
                                    
                                    var rLevel = cachedValues['R'];
                                    if(rLevel == null || rLevel == undefined) rLevel = 0;
                                    
                                    var zDepth = cachedValues['Z'];
                                    if(zDepth == null || zDepth == undefined) zDepth = 0;
                                    
                                    var repeat = cachedValues['L'];
                                    if(repeat == null || repeat == undefined) repeat = 1;
                                    
                                    var pos = JSON.parse(JSON.stringify(this.state.commandedPos));
                                    var lenrot = JSON.parse(JSON.stringify(this.state.polarCoordsLenRot));
                                                  
                                    console.log("Starting with " + lenrot);
                                
                                    for(var i = 0; i < repeat; i++)
                                    {
                                        //Rapid move to XYZ
                                        {
                                            var newData = this.getNewPos(inputValuesXYZ, lenrot, pos);
                                            var newPos = newData[0];
                                            var newLenRot = newData[1];
                                            console.log("NEW POLAR:" + newPos + " :: " + newLenRot);
                                            newPos[2] = pos[2];//Ignore the Z command
                                            
                                            commands.push(new MoveCommand(0, pos, newPos, pos, newPos, 
                                                            null, this.state.feedRate, 0, 0));
                                            
                                            pos = newPos;   lenrot = newLenRot;
                                        }
                                        var initialDepth = pos[2];
                                        var RDepth;
                                        
                                        //Rapid move to R
                                        {
                                            if(this.state.incrementalMode)
                                            {
                                                RDepth = pos[2] + rLevel;
                                            }
                                            else
                                            {
                                                RDepth = rLevel + this.state.toolHome[2] - this.state.zeroOffset[2];
                                            }
                                            var newPos = [pos[0], pos[1], RDepth];
                                            
                                            commands.push(new MoveCommand(0, pos, newPos, pos, newPos, 
                                                            null, SETTINGS.g0speed/60.0, 0, 0));
                                            
                                            pos = newPos;
                                        }
                                        
                                        var ZDepth;
                                        
                                        //Slow move to Z
                                        {
                                            if(this.state.incrementalMode)
                                            {
                                                ZDepth = pos[2] + zDepth;
                                            }
                                            else
                                            {
                                                ZDepth = zDepth + this.state.toolHome[2] - this.state.zeroOffset[2];
                                            }
                                            var newPos = [pos[0], pos[1], ZDepth];
                                            
                                            commands.push(new MoveCommand(1, pos, newPos, pos, newPos, 
                                                            null, this.state.feedRate, 0, 0));
                                            
                                            pos = newPos;
                                        }
                                        
                                        //Fast Retract
                                        {
                                            var returnZ = initialDepth;
                                            
                                            if(this.state.drillReturn == 1)
                                            {
                                                returnZ = RDepth;
                                            }

                                            var newPos = [pos[0], pos[1], returnZ];
                                            
                                            commands.push(new MoveCommand(0, pos, newPos, pos, newPos, 
                                                            null, SETTINGS.g0speed/60, 0, 0));
                                            
                                            pos = newPos;
                                        }
                                        
                                    }
                                    
                                    //Update the commanded position
                                    this.state.commandedPos = [pos[0], pos[1], pos[2]];
                                    this.state.currentLine++;   //Ready for next line
                                    return commands;
                                }

                                switch(this.state.currentGMoveCommand)
                                {
                                    case 92:{this.state.zeroOffset = [cachedValues['X'], cachedValues['Y'], cachedValues['Z']]; } break;
                                }
                            }
                        }
                    }
                    
                    return null;
                }
                
                this.pushedStates = [];
                
                this.fPushState = function()
                {
                    var copied = JSON.parse(JSON.stringify(this.state));
                    this.pushedStates.push(copied);
                }
                
                this.fPopState = function()
                {
                    this.state = this.pushedStates.pop();
                }
                
                this.update = function(dt)
                {
                    var timeToSimulate = dt;
                    
                    //If we already have a tool path, then travel along that
                    timeToSimulate = this.travelPath(timeToSimulate);
                    
                    //If we've finished our tool path
                    if(this.currentPath == null && timeToSimulate > 0)
                    {
                        while(timeToSimulate > 0)
                        {
                            var moveCommands = this.findNextPath();
                            if(moveCommands != null)
                            {
                                //this.fPushState();
                                //var nextMoveCommands = this.findNextPath();
                                //this.fPopState();
                                
                                var toolRadius = this.state.currentTool.d / 2.0;
                                
                                if(moveCommands.length == 1 && (moveCommands[0].compensationEnd != 0))//moveCommands[0].compensationStart != 0 || 
                                {
                                    //Great, we have to deal with cutter compensation
                                    
                                    //Find the next move command
                                    this.fPushState();
                                    var nextMoveCommands = this.findNextPath();
                                    this.fPopState();
                                    
                                    if(nextMoveCommands != null && nextMoveCommands.length == 1)
                                    {
                                        var move1 = moveCommands[0];
                                        var move2 = nextMoveCommands[0];
                                        
                                        var compensationRadius = this.state.currentTool.d / 2.0;
                                        
                                        var shape1 = move1.getCompensatedShape(compensationRadius);
                                        var shape2 = move2.getCompensatedShape(compensationRadius);
                                        
                                        var newEndPoint = shape1.intersects(shape2);
                                        
                                        //console.log(shape1);
                                        //console.log(shape2);
                                        //console.log(newEndPoint);
                                        
                                        
                                        if(newEndPoint != null && newEndPoint != undefined && newEndPoint.length >= 2 && !isNaN(newEndPoint[0]) && !isNaN(newEndPoint[1]))
                                        {
                                            move1.endPos[0] = newEndPoint[0];
                                            move1.endPos[1] = newEndPoint[1];
                                        }
                                        
                                        this.currentPath = [];
                                        this.currentPath.push(move1.generateMove(toolRadius));
                                    }
                                    else
                                    {
                                        this.warn("Can't compensate for cutter with commands: " + JSON.stringify(nextMoveCommands));
                                    }
                                }
                                else
                                {
                                    this.currentPath = [];
                                    for(var i = 0; i < moveCommands.length; i++)
                                    {
                                        var path = moveCommands[i].generateMove(toolRadius);
                                        if(path != undefined && path != null)
                                        {
                                            this.currentPath.push(path);
                                        }
                                    }
                                }
                                
                                if(this.currentPath != null && this.currentPath.length == 0) this.currentPath = null;
                            }
                            

                            if(this.currentPath != null && timeToSimulate > 0)
                            {
                                //We've found a new path, let's travel along it
                                var newTimeRemaining = this.travelPath(timeToSimulate);
                                
                                //If we've still got travel along the path, then exit the loop, we've done as much as we can
                                if(this.currentPath != null || newTimeRemaining == timeToSimulate)
                                {
                                    break;
                                }
                                timeToSimulate = newTimeRemaining;
                                //Otherwise, keep going, lets find the next command!
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                    else if(timeToSimulate != 0)
                    {
                        //Just in case, I'd want to know
                        //console.warn("Your logic is wrong");
                    }
                    
                }
                
                this.toHTML = function()
                {
                    var html = "<table><tr><th>Line</th><th>&nbsp;&nbsp;Code</th></tr>";
                    for(var i = 0; i < this.commandLinesBuffer.length; i++)
                    {
                        html += "<tr><td>" + (i+1) + "</td><td>" + this.commandLinesBuffer[i].toHTML() + "</td></tr>";
                    }
                    html += "</table>";
                    return html;
                }
            }