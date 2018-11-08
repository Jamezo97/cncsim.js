        var dragBarMouseDown = false;
            

            
            var keyForward = false, keyBackward = false, keyLeft = false, keyRight = false, keySpace = false, keyShift = false;

            function onMouseDownGeneric(e)
            {
                var elementClicked = e.target;
                //console.log(elementClicked);
                if(elementClicked !== null && elementClicked !== undefined)
                {
                    if(elementClicked.id == 'dragBar')
                    {
                        dragBarMouseDown = true;
                    }
                }
            }
            function onMouseMoveGeneric(e)
            {
                if(dragBarMouseDown)
                {
                    splitPos += e.movementX;
                    theResizeFunc();
                }
            }
            function onMouseUpGeneric(e)
            {
                dragBarMouseDown = false;
            }
            
            
            function cbDown(event, element)
            {
                processCBUpDown(true, event, element);
            }
            
            function cbUp(event, element)
            {
                processCBUpDown(false, event, element);
            }
            
            function processCBUpDown(downUp, event, element)
            {
                if(event.button == 0)
                {
                    var btnID = element.getAttribute("data-btnid");
                    var xyz = btnID.charAt(0);
                    var pmn= btnID.charAt(1);

                    if(xyz == 'X') xyz = 0;
                    if(xyz == 'Y') xyz = 1;
                    if(xyz == 'Z') xyz = 2;

                    if(pmn == '+') pmn = 1;
                    if(pmn == '-') pmn = -1;
                    if(pmn == ' ') pmn = 0;  
                    
                    if(downUp)
                    {
                        ManualVelocities[xyz] = pmn;
                    }
                    else
                    {
                        ManualVelocities[xyz] = 0;
                    }

                    
                    
                }
            }


            var isMouseDown = false;
            var lastMouseX = 0;
            var lastMouseY = 0;
            
            var rotateX = 0;
            var rotateY = 0;
            
            var rotPitchD = 0;
            var rotYawD = 0;
            
            
            var yawVel = 0;
            var pitchVel = 0;
            
            var inputCount = 0;
            var dMouseX = 0;
            var dMouseY = 0;
            
            var lastYaw = 0;
            var lastPitch = 0;
            var newYaw = 0;
            var newPitch = 0;
            
            function updateInput()
            {
                yawVel -= dMouseX / 180.0;
                pitchVel -= dMouseY / 180.0;
                
                theCamera.rotationYaw += yawVel * DELTA_TIME_FACTOR / 5.0;
                theCamera.rotationPitch += pitchVel * DELTA_TIME_FACTOR / 5.0;
                theCamera.rotationPitch = clamp(theCamera.rotationPitch, -Math.PI/2.0, Math.PI/2.0);
                
                var factor = 1-(0.2*DELTA_TIME_FACTOR);
                
                yawVel *= factor;
                pitchVel *= factor;
                dMouseX = 0;
                dMouseY = 0;
                
            }
            
            function onMouseMove(event)
            {                
                if(isMouseDown)
                {
                    var deltaX = event.clientX - lastMouseX;
                    var deltaY = event.clientY - lastMouseY;
                    dMouseX += event.movementX;
                    dMouseY += event.movementY;
                    
                    //theCamera.rotationYaw -= ;
                    //theCamera.rotationPitch -= deltaY / 180.0;
                    //theCamera.rotationPitch = clamp(theCamera.rotationPitch, -90, 90);
                    
                }
                
                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
            }
            
            function onMouseUp(event)
            {
                isMouseDown = false;
                {
                    keyForward = false; //W
                    keyBackward = false;//A
                    keyLeft = false;    //S
                    keyRight = false;   //D
                    keySpace = false;   //Space
                    keyShift = false;   //Shift
                }
                
                document.exitPointerLock();
            }
            
            function onMouseDown(event)
            {
                isMouseDown = true;
                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
                textCanvas.requestPointerLock();
            }
            

            
            var flyWalk = true;
            
            function toggleFlyWalk()
            {
                flyWalk = !flyWalk;
                theCamera.fly = flyWalk;
                //camera.fly = flyWalk;
            }
            
            
            var keyFlyWalk = false;
            function onKeyDown(event)
            {
                if(isMouseDown)
                {
                    //console.log(event.keyCode);
                    
                    var used = true;
                    switch(event.keyCode)
                    {
                        case 87: keyForward = true; break;  //W
                        case 83: keyBackward = true; break;  //A
                        case 65: keyLeft = true; break;  //S
                        case 68: keyRight = true; break;  //D
                        case 32: keySpace = true; break;  //Space
                        case 16: keyShift = true; break;  //Shift
                        case 16: keyShift = true; break;  //Shift
                        case 84: if(!keyFlyWalk)toggleFlyWalk(); keyFlyWalk = true; break;  //T
                            
                        case 82: reset(); break;  //R
                        default: used = false; break;
                    }
                    if(used)
                    {
                        event.preventDefault();
                    }
                }
                
                
                //console.log("DOWN " + event.keyCode);
            }

            
            function onKeyUp(event)
            {
                if(isMouseDown)
                {
                    var used = true;
                    switch(event.keyCode)
                    {
                        case 87: keyForward = false; break;  //W
                        case 83: keyBackward = false; break;  //A
                        case 65: keyLeft = false; break;  //S
                        case 68: keyRight = false; break;  //D
                        case 32: keySpace = false; break;  //Space
                        case 16: keyShift = false; break;  //Shift
                        case 84: keyFlyWalk = false; break;  //T
                        default: used = false; break;
                    }
                    if(used)
                    {
                        event.preventDefault();
                    }
                }
            }