using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace ServiceLayer
{
    [DataContract]
    public class WebResponce
    {
        [DataMember]
        public int Code { get; set; }

        [DataMember]
        public string Message { get; set; }

        [DataMember]
        public object Data { get; set; }
    }
}
