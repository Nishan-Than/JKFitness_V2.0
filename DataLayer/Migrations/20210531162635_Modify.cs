using Microsoft.EntityFrameworkCore.Migrations;

namespace DataLayer.Migrations
{
    public partial class Modify : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address2",
                table: "MemberShips",
                newName: "Street");

            migrationBuilder.RenameColumn(
                name: "Address1",
                table: "MemberShips",
                newName: "Province");

            

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "MemberShips",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HouseNo",
                table: "MemberShips",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
           

            migrationBuilder.DropColumn(
                name: "District",
                table: "MemberShips");

            migrationBuilder.DropColumn(
                name: "HouseNo",
                table: "MemberShips");

            migrationBuilder.RenameColumn(
                name: "Street",
                table: "MemberShips",
                newName: "Address2");

            migrationBuilder.RenameColumn(
                name: "Province",
                table: "MemberShips",
                newName: "Address1");
        }
    }
}
