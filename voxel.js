
            function WorkpieceShader()
            {
                var me = this;
                
                {
                    var vertexShader = getShader(gl, "2d-vertex-shader");
                    var fragmentShader = getShader(gl, "2d-fragment-shader");

                    this.program = gl.createProgram();

                    gl.attachShader(this.program, vertexShader);
                    gl.attachShader(this.program, fragmentShader);
                    gl.linkProgram(this.program);

                    gl.deleteShader(vertexShader);
                    gl.deleteShader(fragmentShader);

                    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
                    {
                        // An error occurred while linking
                        document.getElementById('heading').innerHTML += "WebGL - Shader Initialization Error";
                        document.getElementById('info').innerHTML += "WebGL could not initialize one, or both, shaders.";
                        gl.deleteProgram(program);
                        return;
                    }
                    
                    gl.useProgram(this.program);
                }
                
                this.modelMatrix_loc = gl.getUniformLocation(this.program, 'modelMatrix');
                this.viewMatrix_loc = gl.getUniformLocation(this.program, 'viewMatrix');
                this.projMatrix_loc = gl.getUniformLocation(this.program, 'projMatrix');
                this.workpieceDims_loc = gl.getUniformLocation(this.program, 'workpieceDims');
                
                this.vertexAttributeLoc = gl.getAttribLocation(this.program, "a_position");
                this.normalAttributeLoc = gl.getAttribLocation(this.program, "a_normal");
                
                gl.vertexAttribPointer(this.vertexAttributeLoc, 3, gl.FLOAT, false, 0, 0);
                gl.vertexAttribPointer(this.normalAttributeLoc, 1, gl.FLOAT, false, 0, 0);
                
                this.loadGLTMatrices = function(glt)
                {
                    this.useShader();
                    gl.uniformMatrix4fv(this.modelMatrix_loc, false, glt.modelMatrix.data);
                    gl.uniformMatrix4fv(this.viewMatrix_loc, false, glt.viewMatrix.data);
                    gl.uniformMatrix4fv(this.projMatrix_loc, false, glt.projectionMatrix.data);
                }
                
                this.setWorkpiece = function(workpiece)
                {
                    var dims = new Float32Array(3);
                    dims[0] = workpiece.xSize;
                    dims[1] = workpiece.ySize;
                    dims[2] = workpiece.zSize;
                    gl.uniform3fv(this.workpieceDims_loc, dims);
                    
                }
                
                this.useShader = function()
                {
                    gl.useProgram(this.program);
                }
                
            }



            

            
            
            function Tool()
            {
                this.posX = 0;
                this.posY = 0;
                this.posZ = 0;
                this.toolRadius = 0;
                this.toolRadiusSq = 0;
                this.roundedTip = false;
                
                this.setToolRadius = function(rad)
                {
                    this.toolRadius = rad;
                    this.toolRadiusSq = rad*rad;
                }
                
                this.getToolTouchPoint = function(x, y)
                {
                    if(this.roundedTip)
                    {
                        var dx = x - this.posX;
                        var dy = y - this.posY;
                        var xyDist = Math.sqrt(dx*dx + dy*dy);
                        
                        var theta = Math.acos(xyDist / this.toolRadius);
                        var zDelta = Math.sin(theta) * this.toolRadius;
                        return this.posZ + this.toolRadius - zDelta;
                    }
                    return this.posZ;
                }
                
                this.isToolTouchingPoint = function(x, y, z)
                {
                    var dx = x - posX;
                    var dy = y - posY;
                    var xySq = dx*dx + dy*dy;
                    
                    if(xySq <= toolRadiusSq)
                    {
                        if(z > this.posZ + this.toolRadius || !this.roundedTip)
                        {
                            return true;
                        }
                        else if(roundedTip)
                        {
                            var dz = (z - (posZ + toolRadius));
                            var xyzSq = xySq + dz*dz;
                            return xyzSq <= toolRadiusSq;
                        }
                        
                    }
                    return false;
                }
            }
            
            function Workpiece()
            {
                this.xSize = -1;
                this.ySize = -1;
                this.zSize = -1;
                this.data = null;
                this.resolution = 1.0;
                
                var xBits = 0;
                var yBits = 0;
                var totalBits = 0;
                var xChunks = 5;
                var yChunks = 5;
                var xChunkSize = 1;
                var yChunkSize = 1;
                var chunkCount = 0;
                
                var blockBuffers = null;
                var normalBuffers = null;
                var triangleCounts = null;
                
                var me = this;
                
                var dirtyChunks;
                
                this.generate = function(xSize, ySize, zSize, resolution)
                {
                    this.xSize = xSize;
                    this.ySize = ySize;
                    this.zSize = zSize;
                    
                    this.resolution = resolution;
                    
                    xBits = this.xSize / resolution;
                    yBits = this.ySize / resolution;
                    totalBits = xBits * yBits;
                    
                    this.data = new Float32Array(totalBits);
                    for(var i = 0; i < totalBits; i++)
                    {
//                        var x = i % xBits;
//                        var y = i / xBits;
//                        console.log(x);
                        this.data[i] = this.zSize;// * (Math.cos(x/10)*Math.sin(y/10)*0.2+0.8);
                    }
                    
                    xChunkSize = 64;
                    yChunkSize = 64;
                    
                    
                    xChunks = Math.ceil((xBits / xChunkSize));
                    yChunks = Math.ceil((yBits / yChunkSize));
                    this.destroy();
                    chunkCount = xChunks * yChunks;
                    
                    dirtyChunks = [chunkCount];
                    for(var i = 0; i < chunkCount; i++) dirtyChunks[i] = true;
                    
                    blockBuffers = Array(chunkCount);
                    normalBuffers = Array(chunkCount);
                    triangleCounts = Array(chunkCount);
                    
                    
                }
                
                this.getHeightF = function(posX, posY, lookAround)
                {
                    lookAround = Math.min(lookAround, this.resolution*2);
                    
                    if(lookAround == 0)
                    {
                        var bitX = Math.floor((posX ) / this.resolution);
                        var bitY = Math.floor((posY ) / this.resolution);
                        
                        return this.getHeight(bitX, bitY);
                    }
                    
                    var look = [
                        [0,0],
                        [-1, 0],
                        [1, 0],
                        [0, -1],
                        [0, 1],
                        [1, 1],
                        [-1, 1],
                        [-1, -1],
                        [1, -1]
                    ];
                    
                    var maxH = -1;
                    var maxIndex = -1;
                    
                    for(var i = 0; i < 5; i++)
                    {
                        var bitX = Math.floor((posX + look[i][0]*lookAround) / this.resolution);
                        var bitY = Math.floor((posY + look[i][1]*lookAround) / this.resolution);
                        
                        var h = this.getHeight(bitX, bitY);
                        if(h > maxH)
                        {
                            maxH = h;
                            maxIndex = i;
                        }
                    }
                    
                    
                    return [maxH, maxIndex];
                }
                
                this.getHeight = function(xBit, yBit)
                {
                    if(xBit < 0 || xBit >= xBits || yBit < 0 || yBit >= yBits)
                    {
                        return 0;
                    }
                    return this.data[xBit + yBit * xBits];
                }
                
                
                this.initGL = function()
                {
                    //gl.deleteBuffer();
                    
                    for(var i = 0; i < chunkCount; i++)
                    {
                        blockBuffers[i] = gl.createBuffer();
                        normalBuffers[i] = gl.createBuffer();
                    }
                    
                }
                
                this.destroy = function()
                {
                    for(var i = 0; i < chunkCount; i++)
                    {
                        gl.deleteBuffer(blockBuffers[i]);
                        gl.deleteBuffer(normalBuffers[i]);
                    }
                    chunkCount = 0;
                }
                
                function clamp(a, b, c)
                {
                    if(a < b) return b;
                    if(a > c) return c;
                    return a;
                }
                
                this.cut = function(tool)
                {
                    //tool.roundedTip = true;
                    var minX = Math.floor((tool.posX - tool.toolRadius - this.resolution) / this.resolution);
                    var minY = Math.floor((tool.posY - tool.toolRadius - this.resolution) / this.resolution);
                    var maxX = Math.ceil((tool.posX + tool.toolRadius + this.resolution) / this.resolution);
                    var maxY = Math.ceil((tool.posY + tool.toolRadius + this.resolution) / this.resolution);
                    minX = clamp(minX, 0, xBits-1);
                    maxX = clamp(maxX, 0, xBits);
                    minY = clamp(minY, 0, yBits-1);
                    maxY = clamp(maxY, 0, yBits);
                    
                    var changed = false;
                    
                    var toolRadiusSq = tool.toolRadius * tool.toolRadius;
                    tool.toolRadiusSq = toolRadiusSq;
                    
                    for(var y = minY; y < maxY; y++)
                    {
                        var chunkYM = Math.floor((y-1) / yChunkSize);
                        var chunkY = Math.floor(y / yChunkSize);
                        var chunkYP = Math.floor((y+1) / yChunkSize);
                        for(var x = minX; x < maxX; x++)
                        {
                            var chunkXM = Math.floor((x-1) / xChunkSize);
                            var chunkX = Math.floor(x / xChunkSize);
                            var chunkXP = Math.floor((x+1) / xChunkSize);
                            var mmX = (x+0.5) * this.resolution;
                            var mmY = (y+0.5) * this.resolution;
                            
                            var dx = mmX - tool.posX;
                            var dy = mmY - tool.posY;
                            var dxdy = dx*dx + dy*dy;
                            if(dxdy <= toolRadiusSq)
                            {
                                var height = tool.getToolTouchPoint(mmX, mmY);
                                if(height < 0) height = 0;
                                
                                if(height < this.zSize)
                                {

                                    var ndex = x + y*xBits;
                                    var currentHeight = this.data[ndex];
                                    if(height !== NaN && currentHeight > 0 && height < currentHeight)
                                    {
                                        this.data[ndex] = height;

                                        changed = true;
                                        this.setChunkDirty(chunkX, chunkY);
                                        if(chunkXP != chunkX)
                                        {
                                            this.setChunkDirty(chunkXP, chunkY);
                                        }
                                        else if(chunkXM != chunkX)
                                        {
                                            this.setChunkDirty(chunkXM, chunkY);
                                        }
                                        if(chunkYP != chunkY)
                                        {
                                            this.setChunkDirty(chunkX, chunkYP);
                                        }
                                        else if(chunkYM != chunkY)
                                        {
                                            this.setChunkDirty(chunkX, chunkYM);
                                        }
                                        //this.setChunkDirty(chunkX+1, chunkY+1);
                                        //this.setChunkDirty(chunkX+1, chunkY);
                                        //this.setChunkDirty(chunkX, chunkY+1);
                                    }
                                }
                            }
                        }
                    }
                    
                    if(changed)
                    {
                        //var minChunkX = Math.floor(minX / xChunkSize); 
                       // var minChunkX = Math.floor(minX / xChunkSize);    
                    }
                }
                
                this.setChunkDirty = function(chunkX, chunkY)
                {
                    if(chunkX < 0 || chunkY < 0 || chunkX >= xChunks || chunkY >= yChunks) return;
                    dirtyChunks[chunkX + chunkY*xChunks] = true;
                }
                
                this.updateModelData = function(justMakeSquare)
                {
                    if(justMakeSquare !== true && justMakeSquare !== false)
                    {
                        justMakeSquare = false;
                    }
                    
                    
                    var offsets = [
                        [-1, 0, 0],     //Left
                        [1, 0, 0],      //Right
                        [0, -1, 0],     //Front
                        [0, 1, 0],      //Back
                        [0, 0, -1],     //Bottom
                        [0, 0, 1]       //Top
                    ];

                    var faceWindings = [
                        [[0,0,1], [0,1,1], [0,1,0], [0,0,0]], //Left
                        [[1,1,1], [1,0,1], [1,0,0], [1,1,0]], //Right
                        [[1,0,1], [0,0,1], [0,0,0], [1,0,0]], //Front
                        [[0,1,1], [1,1,1], [1,1,0], [0,1,0]], //Back
                        [[1,0,0], [1,1,0], [0,1,0], [0,0,0]], //Bottom
                        [[1,1,1], [1,0,1], [0,0,1], [0,1,1]]  //Top
                    ];
                    
                    var faceWindings2 = [
                        [[0,0,1], [0,1,1], [0,1,0], [0,0,0]], //Left
                        [[1,1,1], [1,0,1], [1,0,0], [1,1,0]], //Right
                        [[1,0,1], [0,0,1], [0,0,0], [1,0,0]], //Front
                        [[0,1,1], [1,1,1], [1,1,0], [0,1,0]], //Back
                        [[1,0,0], [1,1,0], [0,1,0], [0,0,0]], //Bottom
                        [[1,1,1], [1,0,1], [0,0,1], [0,1,1]]  //Top
                    ];
                    
                    
                    var faceCounts = Array(chunkCount);
                    
                    for(var chunkY = 0, chunkIndex = 0; chunkY < yChunks; chunkY++)
                    {
                        for(var chunkX = 0; chunkX < xChunks; chunkX++, chunkIndex++)
                        {
                            if(dirtyChunks[chunkIndex])
                            {
                                var faceCount = 0;
                                
                                if(justMakeSquare)
                                {
                                    faceCount += 2;
                                    
                                    faceCount += 4;
//                                    if(chunkX == 0) faceCount++;
//                                    if(chunkX == xChunks-1) faceCount++;
//                                    if(chunkY == 0) faceCount++;
//                                    if(chunkY == yChunks-1) faceCount++;
                                }
                                else
                                {
                                    var startX = chunkX * xChunkSize;
                                    var startY = chunkY * yChunkSize;
                                    var endX = Math.min(xBits, startX + xChunkSize);
                                    var endY = Math.min(yBits, startY + yChunkSize);

                                    for(var y = startY; y < endY; y++)
                                    {
                                        for(var x = startX; x < endX; x++)
                                        {
                                            var myHeight = this.getHeight(x, y);
                                            if(myHeight <= 0) continue;
                                            for(var i = 0; i < 4; i++)
                                            {
                                                var h2 = this.getHeight(x+offsets[i][0], y+offsets[i][1]);
                                                if(myHeight > h2)
                                                {
                                                    faceCount++;
                                                }
                                            }
                                            faceCount+=2;   //Add top and bottom
                                        }
                                    }
                                }
                                faceCounts[chunkIndex] = faceCount;
                            }
                        }       
                    }
                    
                    var quadToTriangle = [0,1,2,  0,2,3];
                    
                    for(var chunkY = 0, chunkIndex = 0; chunkY < yChunks; chunkY++)
                    {
                        for(var chunkX = 0; chunkX < xChunks; chunkX++, chunkIndex++)
                        { 
                            if(dirtyChunks[chunkIndex])
                            {
                                dirtyChunks[chunkIndex] = false;
                                
                                var blockBufferIndex = 0;
                                var normalBufferIndex = 0;
                                var blockBufferData = new Float32Array(faceCounts[chunkIndex] * 6 * 3);
                                var normalBufferData = new Float32Array(faceCounts[chunkIndex] * 6 * 1);
                                
                                var startX = chunkX * xChunkSize;
                                var startY = chunkY * yChunkSize;
                                var endX = Math.min(xBits, startX + xChunkSize);
                                var endY = Math.min(yBits, startY + yChunkSize);
                                
                                if(justMakeSquare)
                                {
                                    var myHeight =  this.zSize;
                                    //Add top and bottom faces
                                    for(var i = 0; i < 6; i++)
                                    {
                                        if((i == 0 && chunkX != 0) || (i == 1 && chunkX != xChunks-1) || (i == 2 && chunkY != 0) || (i == 3 && chunkY != yChunks-1))
                                        {
                                            //If we're not at the edge, then don't render the edge
                                            //continue;
                                        }
                                        
                                        var scaleX = (endX - startX)/xChunkSize;
                                        var scaleY = (endY - startY)/yChunkSize;
                                        
                                        for(var j = 0; j < 6; j++)
                                        {
                                            blockBufferData[blockBufferIndex++] = this.resolution*(startX+faceWindings[i][quadToTriangle[j]][0]*xChunkSize*scaleX);
                                            blockBufferData[blockBufferIndex++] = this.resolution*(startY+faceWindings[i][quadToTriangle[j]][1]*yChunkSize*scaleY);
                                            blockBufferData[blockBufferIndex++] = (faceWindings[i][quadToTriangle[j]][2] * myHeight);
                                            normalBufferData[normalBufferIndex++] = i;
                                        }
                                    }
                                }
                                else
                                {
                                    for(var y = startY; y < endY; y++)
                                    {
                                        for(var x = startX; x < endX; x++)
                                        {
                                            var myHeight = this.getHeight(x, y);
                                            if(myHeight <= 0) continue;
                                            for(var i = 0; i < 4; i++)
                                            {
                                                var h2 = this.getHeight(x+offsets[i][0], y+offsets[i][1]);
                                                if(myHeight > h2)
                                                {
                                                    var c = h2;
                                                    var m = (myHeight - h2);
                                                    for(var j = 0; j < 6; j++)
                                                    {
                                                        blockBufferData[blockBufferIndex++] = this.resolution*(x+faceWindings[i][quadToTriangle[j]][0]);
                                                        blockBufferData[blockBufferIndex++] = this.resolution*(y+faceWindings[i][quadToTriangle[j]][1]);
                                                        blockBufferData[blockBufferIndex++] = (m*faceWindings[i][quadToTriangle[j]][2] + c);
                                                        normalBufferData[normalBufferIndex++] = i;
                                                    }
                                                }
                                            }
                                            //add top and bottom
                                            {
                                                for(var i = 4; i < 6; i++)
                                                {   
                                                    for(var j = 0; j < 6; j++)
                                                    {
                                                        blockBufferData[blockBufferIndex++] = this.resolution*(x+faceWindings[i][quadToTriangle[j]][0]);
                                                        blockBufferData[blockBufferIndex++] = this.resolution*(y+faceWindings[i][quadToTriangle[j]][1]);
                                                        blockBufferData[blockBufferIndex++] = (faceWindings[i][quadToTriangle[j]][2] * myHeight);
                                                        normalBufferData[normalBufferIndex++] = i;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                triangleCounts[chunkIndex] = faceCounts[chunkIndex]*6;

                                gl.bindBuffer(gl.ARRAY_BUFFER, blockBuffers[chunkIndex]);
                                gl.bufferData(gl.ARRAY_BUFFER, blockBufferData, gl.STATIC_DRAW);


                                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffers[chunkIndex]);
                                gl.bufferData(gl.ARRAY_BUFFER, normalBufferData, gl.STATIC_DRAW);
                            }
                        }       
                    }
                    
                }
                
                this.reset = function()
                {
                    for(var i = 0; i < totalBits; i++)
                    {
                        this.data[i] = this.zSize;
                    }
                    for(var i = 0; i < chunkCount; i++) dirtyChunks[i] = true;
                }
                
                this.render = function(shader)
                {
                    shader.setWorkpiece(this);
                    for(var i = 0; i < chunkCount; i++)
                    {
                        if(triangleCounts[i] > 0)
                        {
                            gl.bindBuffer(gl.ARRAY_BUFFER, blockBuffers[i]);
                            gl.vertexAttribPointer(defaultShader.vertexAttributeLoc, 3, gl.FLOAT, false, 0, 0);
                            gl.enableVertexAttribArray(shader.vertexAttributeLoc);

                            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffers[i]);
                            gl.vertexAttribPointer(defaultShader.normalAttributeLoc, 1, gl.FLOAT, false, 0, 0);
                            gl.enableVertexAttribArray(shader.normalAttributeLoc);

                            gl.drawArrays(gl.TRIANGLES, 0, triangleCounts[i]);  
                        }
                    }
                }
            }