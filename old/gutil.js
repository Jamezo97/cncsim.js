
//===========================================================
//
//          VECTOR
//
//===========================================================

function Vec3(initialData)
{
    this.data = [0, 0, 0];
    if(initialData != null && initialData != undefined && initialData.length > 0)
    {
        for(var i = 0; i < initialData.length && i < 3; i++)
        {
            this.data[i] = Number(initialData[i]);
        }
    }
    
    this.length = function()
    {
        return Math.sqrt(this.data[0]*this.data[0]+this.data[1]*this.data[1]+this.data[2]*this.data[2]);
    }

    this.dot = function(vec)
    {
        return this.data[0]*vec.data[0]+this.data[1]*vec.data[1]+this.data[2]*vec.data[2];
    }

    this.toUnitVector = function()
    {
        var len = this.length();
        var result = new Vec3([
            this.data[0] / len,
            this.data[1] / len,
            this.data[2] / len
        ]);

        return result;
    }

    this.normalize = function()
    {
        var len = this.length();
        this.data[0] /= len;
        this.data[1] /= len;
        this.data[2] /= len;
        
        return this;
    }
    
    this.subtract = function(vec)
    {
        return new Vec3([
            this.data[0] - vec.data[0],
            this.data[1] - vec.data[1],
            this.data[2] - vec.data[2]
        ]);
    }
    
    this.add = function(vec)
    {
        return new Vec3([
            this.data[0] + vec.data[0],
            this.data[1] + vec.data[1],
            this.data[2] + vec.data[2]
        ]);
    }
    
    this.mult = function(scale)
    {
        return new Vec3([
            this.data[0] * scale,
            this.data[1] * scale,
            this.data[2] * scale
        ]);
    }
    
    this.angleXY = function()
    {
        return Math.atan2(this.data[1], this.data[0]);
    }
    
    this.cross = function(vec)
    {
        return new Vec3([
            this.data[1]*vec.data[2] - this.data[2]*vec.data[1],
            this.data[2]*vec.data[0] - this.data[0]*vec.data[2],
            this.data[0]*vec.data[1] - this.data[1]*vec.data[0]
        ]);
    }
    
    
    
}

function Vec4(initialData) {
    this.data = new Float32Array(4);
    
    if(initialData !== null && initialData !== undefined) {
        for (var i = 0; i < initialData.length && i < 4; i++)
        {
            this.data[i] = initialData[i];
        }
    }
    this.clone = function()
    {
        var vec = new Vec4();
        vec.copyFrom(this);
        return vec;
    }

    this.copyFrom = function(vec)
    {
        this.data[0] = vec.data[0];
        this.data[1] = vec.data[1];
        this.data[2] = vec.data[2];
        this.data[3] = vec.data[3];
    }

    this.loadData = function(values)
    {
        this.data[0] = values[0];
        this.data[1] = values[1];
        this.data[2] = values[2];
        this.data[3] = values[3];
    }

    this.fill = function(val)
    {
        this.data[0] = val;
        this.data[1] = val;
        this.data[2] = val;
        this.data[3] = val;
    }

    this.length = function()
    {
        return Math.sqrt(this.data[0]*this.data[0]+this.data[1]*this.data[1]+this.data[2]*this.data[2]+this.data[3]*this.data[3]);
    }

    this.dot = function(vec)
    {
        return this.data[0]*vec.data[0]+this.data[1]*vec.data[1]+this.data[2]*vec.data[2]+this.data[3]*vec.data[3];
    }

    this.toUnitVector = function()
    {
        var len = this.length();
        var result = new Vec4([
            this.data[0] / len,
            this.data[1] / len,
            this.data[2] / len,
            this.data[3] / len
        ]);

        return result;
    }

    this.normalize = function()
    {
        var len = this.length();
        this.data[0] /= len;
        this.data[1] /= len;
        this.data[2] /= len;
        this.data[3] /= len;
    }

}

//===========================================================
//
//          MATRIX
//
//===========================================================
function Matrix4(initialData) {
    this.data = new Float32Array(16);

    if(initialData !== null && initialData !== undefined)
    {
        for(var i = 0; i < initialData.length && i < 16; i++)
        {
            this.data[i] = initialData[i];
        }
    }

    this.clone = function()
    {
        var mat = new Matrix4();
        mat.copyFrom(this);
        return mat;
    }

    this.copyFrom = function(mat)
    {
        for(var i = 0; i < 16; i++)
        {
            this.data[i] = mat.data[i];
        }
    }

    this.loadData = function(values)
    {
        for(var i = 0; i < 16; i++) this.data[i] = values[i];
    }

    this.fill = function(val)
    {
        for(var i = 0; i < 16; i++) this.data[i] = val;
    }

    this.loadIdentity = function()
    {
        this.data[1]=this.data[2]=this.data[3]=this.data[4]=this.data[6]=this.data[7]=this.data[8]=this.data[9]=this.data[11]=this.data[12]=this.data[13]=this.data[14]=0;
        this.data[0] = this.data[5] = this.data[10] = this.data[15] = 1;
    }

    this.vecMultiply = function(vec)
    {
        var result = new Vec4([
            vec.data[0] * this.data[0] + vec.data[1] * this.data[4] + vec.data[2] * this.data[8] + vec.data[3] * this.data[12],
            vec.data[0] * this.data[1] + vec.data[1] * this.data[5] + vec.data[2] * this.data[9] + vec.data[3] * this.data[13],
            vec.data[0] * this.data[2] + vec.data[1] * this.data[6] + vec.data[2] * this.data[10] + vec.data[3] * this.data[14],
            vec.data[0] * this.data[3] + vec.data[1] * this.data[7] + vec.data[2] * this.data[11] + vec.data[3] * this.data[15],
        ]);
        return result;
    }

    this.multiply = function(m1)
    {
        var m2 = this;
        var matrix = new Matrix4([
            m1.data[0]*m2.data[0] + m1.data[1]*m2.data[4] + m1.data[2]*m2.data[8] + m1.data[3]*m2.data[12],
            m1.data[0]*m2.data[1] + m1.data[1]*m2.data[5] + m1.data[2]*m2.data[9] + m1.data[3]*m2.data[13],
            m1.data[0]*m2.data[2] + m1.data[1]*m2.data[6] + m1.data[2]*m2.data[10] + m1.data[3]*m2.data[14],
            m1.data[0]*m2.data[3] + m1.data[1]*m2.data[7] + m1.data[2]*m2.data[11] + m1.data[3]*m2.data[15],

            m1.data[4]*m2.data[0] + m1.data[5]*m2.data[4] + m1.data[6]*m2.data[8] + m1.data[7]*m2.data[12],
            m1.data[4]*m2.data[1] + m1.data[5]*m2.data[5] + m1.data[6]*m2.data[9] + m1.data[7]*m2.data[13],
            m1.data[4]*m2.data[2] + m1.data[5]*m2.data[6] + m1.data[6]*m2.data[10] + m1.data[7]*m2.data[14],
            m1.data[4]*m2.data[3] + m1.data[5]*m2.data[7] + m1.data[6]*m2.data[11] + m1.data[7]*m2.data[15],

            m1.data[8]*m2.data[0] + m1.data[9]*m2.data[4] + m1.data[10]*m2.data[8] + m1.data[11]*m2.data[12],
            m1.data[8]*m2.data[1] + m1.data[9]*m2.data[5] + m1.data[10]*m2.data[9] + m1.data[11]*m2.data[13],
            m1.data[8]*m2.data[2] + m1.data[9]*m2.data[6] + m1.data[10]*m2.data[10] + m1.data[11]*m2.data[14],
            m1.data[8]*m2.data[3] + m1.data[9]*m2.data[7] + m1.data[10]*m2.data[11] + m1.data[11]*m2.data[15],

            m1.data[12]*m2.data[0] + m1.data[13]*m2.data[4] + m1.data[14]*m2.data[8] + m1.data[15]*m2.data[12],
            m1.data[12]*m2.data[1] + m1.data[13]*m2.data[5] + m1.data[14]*m2.data[9] + m1.data[15]*m2.data[13],
            m1.data[12]*m2.data[2] + m1.data[13]*m2.data[6] + m1.data[14]*m2.data[10] + m1.data[15]*m2.data[14],
            m1.data[12]*m2.data[3] + m1.data[13]*m2.data[7] + m1.data[14]*m2.data[11] + m1.data[15]*m2.data[15],
        ]);
        return matrix;
    }

    this.toString = function()
    {
        var result = "";
        for(var row = 0; row < 4; row++)
        {
            if(result != 0) result += "\n";
            result += "["
            for(var col = 0; col < 4; col++)
            {
                if(col != 0) result += "\t";
                result += this.data[row + col*4];
            }
            result += "]";
        }

        return result;
    }
}

//===========================================================
//
//          OPENGL Camera
//
//===========================================================
function Camera()
{
    this.rotationPitch = 0;
    this.rotationYaw = 0;
    this.posX = 0;
    this.posY = 0;
    this.posZ = 0;

    this.motionX = 0;
    this.motionY = 0;
    this.motionZ = 0;

    this.friction = 0.99;

    this.movementSpeed = 0.01;
    this.fly = true;

    this.translateCamera = function()
    {
        glt.glTranslate(-this.posX, -this.posY, -this.posZ);
    }

    this.rotateCamera = function()
    {
        glt.glRotate(-this.rotationYaw*180/Math.PI, 0, 0, 1);
        glt.glRotate(-this.rotationPitch*180/Math.PI, 1, 0, 0);
    }

    this.transform = function()
    {
        this.translateCamera();
        this.rotateCamera();
    }

    this.move = function(deltaAngle, acc)
    {
        deltaAngle += this.rotationYaw;
        acc *= DELTA_TIME_FACTOR;

        this.motionX -= Math.sin(deltaAngle) * acc;
        this.motionY += Math.cos(deltaAngle) * acc;
    }

    this.update = function()
    {
        var newFriction = (1-((1-this.friction)*DELTA_TIME_FACTOR));
        if(keyForward)
        {
            this.move(0, this.movementSpeed);
        }
        if(keyBackward)
        {
            this.move(0 + Math.PI, this.movementSpeed);
        }

        if(keyLeft)
        {
            this.move(0 + Math.PI/2.0, this.movementSpeed);
        }
        if(keyRight)
        {
            this.move(0 - Math.PI/2.0, this.movementSpeed);
        }
        if(this.fly)
        {
            if(keySpace)
            {
                this.motionZ += this.movementSpeed;
            }

            if(keyShift)
            {
                this.motionZ -= this.movementSpeed;
            }
        }
        else
        {
            var worldState = workpiece.getHeightF(this.posX, this.posY, 1);
            var myCurrentMinHeight = workpiece.getHeightF(this.posX, this.posY, 0);

            var maxHeight = worldState[0] + 1.6;
            var maxFoundDir = worldState[1];

            var deltaHeight = maxHeight - this.posZ;

            var minHeight = maxHeight;//workpiece.getHeightF(this.posX, this.posY, 0.1) + 1.6;

            if(this.posZ <= minHeight)
            {
                this.motionZ = 0;
                this.posZ = minHeight;
                if(keySpace)
                {
                    this.motionZ += 0.5;
                }
            }
            else
            {
                this.motionZ -= 0.005 * DELTA_TIME_FACTOR;
            }
        }


        this.posX += this.motionX*DELTA_TIME_FACTOR;
        this.posY += this.motionY*DELTA_TIME_FACTOR;
        this.posZ += this.motionZ*DELTA_TIME_FACTOR;


        this.motionX *= newFriction;//*DELTA_TIME_FACTOR;
        this.motionY *= newFriction;//*DELTA_TIME_FACTOR;
        this.motionZ *= newFriction;//*DELTA_TIME_FACTOR;

        if(!this.fly)
        {
            this.motionX *= newFriction*newFriction*newFriction;
            this.motionY *= newFriction*newFriction*newFriction;
        }
    }
}

//===========================================================
//
//          OPENGL Transformations
//
//===========================================================
function GLT() {
    var matrixMode = 0;

    var modelMatrixStack = [];
    var viewMatrixStack = [];
    var projectionMatrixStack = [];

    this.modelMatrix = new Matrix4();
    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();

    this.modelMatrix.loadIdentity();
    this.viewMatrix.loadIdentity();
    this.projectionMatrix.loadIdentity();

    this.glModelMatrixMode = function()
    {
        matrixMode = 0;
    }
    this.glViewMatrixMode = function()
    {
        matrixMode = 1;
    }
    this.glProjectionMatrixMode = function()
    {
        matrixMode = 2;
    }

    this.glPushMatrix = function()
    {
        switch(matrixMode)
        {
            case 0: modelMatrixStack.push(this.modelMatrix.clone()); break;
            case 1: viewMatrixStack.push(this.viewMatrix.clone()); break;
            case 2: projectionMatrixStack.push(this.projectionMatrix.clone()); break;
        }
    }

    this.glPopMatrix = function()
    {
        switch(matrixMode)
        {
            case 0: this.modelMatrix.copyFrom(modelMatrixStack.pop()); break;
            case 1: this.viewMatrix.copyFrom(viewMatrixStack.pop()); break;
            case 2: this.projectionMatrix.copyFrom(projectionMatrixStack.pop()); break;
        }
    }

    this.glLoadIdentity = function()
    {
        switch(matrixMode)
        {
            case 0: this.modelMatrix.loadIdentity(); break;
            case 1: this.viewMatrix.loadIdentity(); break;
            case 2: this.projectionMatrix.loadIdentity(); break;
        }
    }

    this.glMultMatrix = function(matrix)
    {
        switch(matrixMode)
        {
            case 0: this.modelMatrix = matrix.multiply(this.modelMatrix); break;
            case 1: this.viewMatrix = matrix.multiply(this.viewMatrix); break;
            case 2: this.projectionMatrix = matrix.multiply(this.projectionMatrix); break;
        }
    }

    this.glScale = function(x, y, z)
    {
        var scaleMatrix = new Matrix4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ]);
        this.glMultMatrix(scaleMatrix);
    }

    this.glTranslate = function(x, y, z)
    {
        var translateMatrix = new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);
        this.glMultMatrix(translateMatrix);
    }

    this.glRotate = function(angle, x, y, z)
    {
        angle = angle / 180 * Math.PI;
        var c = Math.cos(angle);
        var s = Math.sin(angle);

        var cm = 1-c;

        var rotMatrix = new Matrix4([
            c+x*x*cm,      y*x*cm+z*s,        z*x*cm-y*s, 0,
            x*y*cm - z*s,  c+y*y*cm,          z*y*cm+x*s, 0,
            x*z*cm+y*s,    x*z*cm-x*s,        c+z*z*cm,   0,
            0,             0,                 0,          1
        ]);

        this.glMultMatrix(rotMatrix);
    }

    this.glPerspective = function(fovy, aspect, n, f)
    {
        var dz = f - n;
        var cot = 1 / Math.tan(fovy / 2.0 * Math.PI / 180.0);

        var perspMatrix = new Matrix4([
            cot / aspect,   0,      0,      0,
            0,              cot,    0,      0,
            0,              0,     - (f + n) / dz, -1,
            0,              0, -2 * n * f / dz, 0
        ]);

        this.glMultMatrix(perspMatrix);
    }
    
    this.convertToScreenSpace = function(vec)
    {
        var pvm = this.projectionMatrix.multiply(this.viewMatrix.multiply(this.modelMatrix));
        var vecOut = pvm.vecMultiply(vec);
        vecOut.data[0] /= vecOut.data[3];
        vecOut.data[1] /= vecOut.data[3];
        vecOut.data[2] /= vecOut.data[3];
        vecOut.data[3] /= vecOut.data[3];
        
        return vecOut
    }
}