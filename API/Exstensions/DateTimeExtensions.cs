using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Exstensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateOnly dob)
        {
            var span = DateTime.UtcNow - dob.ToDateTime(new TimeOnly());

            return Convert.ToInt32(span.TotalDays / 365.25);
        }
    }
}
